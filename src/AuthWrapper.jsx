import { useState, useEffect } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAt,
    faInputNumeric,
    faKeySkeleton,
    faPaperPlaneTop,
    faArrowRightToBracket,
    // faGlobe,
} from '@fortawesome/pro-regular-svg-icons'

import { cookies, clearAllAuthCookies, keepAuthAlive, callApi } from './utils'
import { authCookiesMaxAgeSeconds, MIDDLEWARE_URL } from './constants/config'
import { ButtonIcon } from './components'

let keepAliveInterval

export const AuthWrapper = ({ isLoggedIn, setLoggedIn, children }) => {
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [token, setToken] = useState('')
    const [isCodeLoading, setCodeLoading] = useState(false)
    const [isCodeSent, setCodeSent] = useState(false)
    const [isLoginLoading, setLoginLoading] = useState(false)
    const [shouldRememberMe, setShouldRememberMe] = useState(cookies.get('rememberMe') === 'true')

    const maxAge = authCookiesMaxAgeSeconds[shouldRememberMe]
    const path = '/'

    useEffect(() => {
        if (isLoggedIn) {
            keepAuthAlive({ path, maxAge })
            keepAliveInterval = setInterval(() => {
                keepAuthAlive({ path, maxAge })
            }, (maxAge / 2) * 1000)
        } else {
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
                toast.success('Déconnexion OK')
            }
        })
    }, [])

    const onSendCodeButtonClick = (event) => {
        event.preventDefault()
        setCodeLoading(true)
        setCodeSent(false)
        ;(async () => {
            const response = await (
                await fetch(`${MIDDLEWARE_URL}/auth/sendCode`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({ email, code }),
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
            const response = await callApi({
                path: 'auth/checkCodeAndToken',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code, token }),
                // successCallback: () => toast.success('Login OK !'),
            })

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
                }, (maxAge / 2) * 1000)
            } else {
                toast.error(
                    "Votre token n'est pas trouvé dans Claroline ou n'est pas associé à votre compte, ou votre code e-mail n'est pas correct"
                )
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
                    <h1 className="mt-4">Connexion</h1>
                    {!isCodeSent ? (
                        <Form className="mb-4" onSubmit={onSendCodeButtonClick}>
                            <h4 className="mt-4">1/2 - Votre courriel :</h4>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Courriel</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faAt} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        required
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
                            {/* <Form.Group className="mb-3">
                                <Form.Label>Environnement de travail</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faGlobe} />
                                    </InputGroup.Text>
                                    <Form.Select
                                        aria-label="Environnement"
                                        // value={type}
                                        // onChange={onChangeEventField({ fieldName: 'type', id })}
                                    >
                                        <option value="dev">DEV (cep-dev.ch)</option>
                                        <option value="val">VAL (cep-val.ch)</option>
                                        <option value="prod">PROD (cep.swiss)</option>
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group> */}
                            <Button variant="primary" type="submit">
                                <ButtonIcon isLoading={isCodeLoading} icon={faPaperPlaneTop} />
                                Envoyer code
                            </Button>
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
                                        placeholder="123456"
                                        value={code}
                                        onChange={({ target: { value } }) => setCode(value)}
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Le nouveau code temporaire que vous avez reçu par e-mail
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Jeton d'authentification</Form.Label>
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
                                <Form.Text className="text-muted">
                                    Votre token secret personnel associé à votre compte Claroline
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicRememberMe">
                                <Form.Check
                                    type="checkbox"
                                    label="Se souvenir de moi"
                                    value={shouldRememberMe}
                                    onChange={({ target: { checked } }) => setShouldRememberMe(checked)}
                                />
                                <Form.Text className="text-muted">
                                    Rester identifié.e même après fermeture de navigateur (max. 30 minutes)
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={onLoginButtonClick}>
                                <ButtonIcon isLoading={isLoginLoading} icon={faArrowRightToBracket} />
                                Connexion
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
