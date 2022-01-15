import { useState, useEffect } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonToPortal } from '@fortawesome/pro-light-svg-icons'
import {
    faAt,
    faInputNumeric,
    faKeySkeleton,
    faPaperPlaneTop,
    faArrowRightToBracket,
} from '@fortawesome/pro-regular-svg-icons'
import { cookies, clearAllAuthCookies, keepAuthAlive } from './utils'

let keepAliveInterval

export const AuthWrapper = ({ isLoggedIn, setLoggedIn, children }) => {
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [token, setToken] = useState('')
    const [isCodeLoading, setCodeLoading] = useState(false)
    const [isCodeSent, setCodeSent] = useState(false)
    const [isLoginLoading, setLoginLoading] = useState(false)
    const [shouldRememberMe, setShouldRememberMe] = useState(cookies.get('rememberMe') === 'true')

    const maxAge = shouldRememberMe ? '1800' : ''
    const path = '/'
    console.log(shouldRememberMe)

    useEffect(() => {
        if (shouldRememberMe && isLoggedIn) {
            console.log('keepAlive')
            keepAuthAlive({ path, maxAge })
            keepAliveInterval = setInterval(() => {
                keepAuthAlive({ path, maxAge })
            }, 30000)
        } else {
            console.log('clear')
            clearAllAuthCookies()
        }
    }, [])

    useEffect(() => {
        cookies.addChangeListener(({ name, value }) => {
            // clear when logout event is triggered
            if (name === 'isLoggedIn' && typeof value === 'undefined') {
                setEmail('')
                setCode('')
                setToken('')
                setCodeSent(false)
                setShouldRememberMe(false)
                setLoggedIn(false)
                clearInterval(keepAliveInterval)
            }
        })
    }, [])

    const onSendCodeButtonClick = (event) => {
        event.preventDefault()
        setCodeLoading(true)
        setCodeSent(false)
        ;(async () => {
            const response = await (
                await fetch('http://localhost:4000/auth/sendCode', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({ email }),
                })
            ).json()

            const { isCodeSendingSuccessful } = response

            if (isCodeSendingSuccessful) {
                setCodeSent(true)
            } else {
                toast.error("Votre token n'est pas trouvé dans Claroline, merci de contacter votre administrateur")
            }
            setCodeLoading(false)
        })()
    }

    const onLoginButtonClick = (event) => {
        event.preventDefault()
        setLoginLoading(true)
        ;(async () => {
            const response = await (
                await fetch('http://localhost:4000/auth/checkCodeAndToken', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'x-login-email-address': email,
                        'x-login-email-code': code,
                        'x-login-token': token,
                    },
                    body: JSON.stringify({ email, code, token }),
                })
            ).json()

            const { areCodeAndTokenCorrect } = response

            if (areCodeAndTokenCorrect) {
                cookies.set('rememberMe', shouldRememberMe, { path, maxAge })
                cookies.set('isLoggedIn', true, { path, maxAge })
                cookies.set('email', email, { path, maxAge })
                cookies.set('code', code, { path, maxAge })
                cookies.set('token', token, { path, maxAge })

                setLoggedIn(true)

                keepAliveInterval = setInterval(() => {
                    keepAuthAlive({ path, maxAge })
                }, 30000)
            } else {
                toast.error("Votre token n'est pas trouvé dans Claroline, merci de contacter votre administrateur")
            }
            setLoginLoading(false)
        })()
    }

    return isLoggedIn ? (
        children
    ) : (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1 className="mt-4">
                        <FontAwesomeIcon icon={faPersonToPortal} /> Connexion
                    </h1>
                    {!isCodeSent ? (
                        <Form className="mb-4">
                            <h4 className="mt-4">1/2 - Votre courriel :</h4>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Courriel</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faAt} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="mail@example.com"
                                        value={email}
                                        onChange={({ target: { value } }) => setEmail(value)}
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Vous allez recevoir un e-mail avec un code temporaire
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={onSendCodeButtonClick}>
                                <FontAwesomeIcon icon={faPaperPlaneTop} /> Envoyer code
                            </Button>
                            {isCodeLoading && <Spinner animation="grow" size="sm" />}
                        </Form>
                    ) : (
                        <Form>
                            <h4 className="mt-4">2/2 - Votre code et token :</h4>
                            <Form.Group className="mb-3" controlId="formBasicCode">
                                <Form.Label>Code reçu</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faInputNumeric} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="1234"
                                        value={code}
                                        onChange={({ target: { value } }) => setCode(value)}
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Le nouveau code temporaire que vous avez reçu par e-mail
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Token secret</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faKeySkeleton} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="abcdefghiklmnopqrstvxyz0123456789"
                                        value={token}
                                        onChange={({ target: { value } }) => setToken(value)}
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">Votre token secret personnel</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicRememberMe">
                                <Form.Check
                                    type="checkbox"
                                    label="Se souvenir de moi"
                                    value={shouldRememberMe}
                                    onChange={({ target: { checked } }) => setShouldRememberMe(checked)}
                                />
                                <Form.Text className="text-muted">
                                    Rester identifié.e même après fermeture de navigateur
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={onLoginButtonClick}>
                                <FontAwesomeIcon icon={faArrowRightToBracket} /> Connexion
                            </Button>
                            {isLoginLoading && <Spinner animation="grow" size="sm" />}
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
