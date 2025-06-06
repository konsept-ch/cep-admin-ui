import { useState, useEffect } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faAddressCard, faArrowRightToBracket, faKey } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import { cookies, clearAllAuthCookies, keepAuthAlive } from './utils'
import { authCookiesMaxAgeSeconds } from './constants/config'
import { useSendCodeMutation, useCheckCodeAndTokenMutation } from './services/auth'
import { ButtonIcon } from './components'

let keepAliveInterval

export const AuthWrapper = ({ isLoggedIn, setLoggedIn, children }) => {
    const [email, setEmail] = useState(cookies.get('email') || '')
    const [code, setCode] = useState('')
    const [token, setToken] = useState('')
    const [shouldRememberMe, setShouldRememberMe] = useState(true)

    const [sendCode, { isLoading: isCodeLoading, isSuccess: isCodeSent }] = useSendCodeMutation()
    const [checkCodeAndToken, { isLoading: isLoginLoading }] = useCheckCodeAndTokenMutation()

    const maxAge = process.env.NODE_ENV === 'development' ? 999999 : authCookiesMaxAgeSeconds[shouldRememberMe]
    const path = '/'

    useEffect(() => {
        cookies.addChangeListener(({ name, value }) => {
            if (name === 'isLoggedIn' && typeof value === 'undefined') {
                setCode('')
                setToken('')
                setShouldRememberMe(false)
                setLoggedIn(false)
                clearInterval(keepAliveInterval)
                toast.success('Déconnexion OK')
            }
        })

        if (isLoggedIn) {
            keepAuthAlive({ path, maxAge })
            keepAliveInterval = setInterval(() => {
                keepAuthAlive({ path, maxAge })
            }, (maxAge / 2) * 1000)
        } else {
            clearAllAuthCookies()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function onSendCodeButtonClick(e) {
        e.preventDefault()

        cookies.set('email', email, { path, maxAge: 99999999 })

        const { data } = await sendCode({ email })

        if (!data.isCodeSendingSuccessful)
            toast.error("Votre token n'est pas trouvé dans Claroline, merci de contacter votre administrateur")
    }

    async function onLoginButtonClick(e) {
        e.preventDefault()

        const { data } = await checkCodeAndToken({ email, code, token })

        if (data.areCodeAndTokenCorrect) {
            cookies.set('rememberMe', shouldRememberMe, { path, maxAge })
            cookies.set('isLoggedIn', true, { path, maxAge })
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
                            <Button variant="primary" type="submit">
                                <ButtonIcon isLoading={isCodeLoading} icon={faPaperPlane} />
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
                                        <FontAwesomeIcon icon={faAddressCard} />
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
                                        <FontAwesomeIcon icon={faKey} />
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
                                    label="Se souvenir de moi (max. 12 heures)"
                                    value={shouldRememberMe}
                                    onChange={({ target: { checked } }) => setShouldRememberMe(checked)}
                                />
                                <Form.Text className="text-muted">
                                    Rester identifié.e même après fermeture de navigateur/onglet
                                    <br />
                                    ou mise en vielle de votre appareil
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
