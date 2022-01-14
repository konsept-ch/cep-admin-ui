import { useState } from 'react'
import { Button, Container, Form, InputGroup, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faInputNumeric, faKeySkeleton } from '@fortawesome/pro-light-svg-icons'

export const AuthWrapper = ({ children }) => {
    const [emailField, setEmailField] = useState('')
    const [tokenField, setTokenField] = useState('')
    const [isCodeLoading, setCodeLoading] = useState(false)
    const [isCodeSent, setCodeSent] = useState(false)
    const [isLoggedIn, setLoggedIn] = useState(false)

    const onSendCodeButtonClick = (event) => {
        event.preventDefault()
        setCodeLoading(true)
        ;(async () => {
            const response = await (
                await fetch('http://localhost:4000/auth', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({ emailField, tokenField }),
                })
            ).json()

            const { isAuthSuccessful } = response

            if (isAuthSuccessful) {
                setCodeSent(true)
            } else {
                toast.error("Votre token n'est pas trouvé dans Claroline, merci de contacter votre administrateur")
            }
            setCodeLoading(false)
        })()
    }

    const onLoginButtonClick = (event) => {
        event.preventDefault()
    }

    return isLoggedIn ? (
        children
    ) : (
        <Container>
            <h1 className="mt-4">Identification</h1>
            <h4 className="mt-4">Votre courriel et token :</h4>
            <Form className="mb-4">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Courriel</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faAt} />
                        </InputGroup.Text>
                        <Form.Control
                            type="email"
                            placeholder="mail@example.com"
                            value={emailField}
                            onChange={({ target: { value } }) => setEmailField(value)}
                        />
                    </InputGroup>
                    <Form.Text className="text-muted">Vous allez recevoir un e-mail avec un code temporaire</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Token</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faKeySkeleton} />
                        </InputGroup.Text>
                        <Form.Control
                            type="password"
                            placeholder="abcdefghiklmnopqrstvxyz0123456789"
                            value={tokenField}
                            onChange={({ target: { value } }) => setTokenField(value)}
                        />
                    </InputGroup>
                    <Form.Text className="text-muted">Votre token secret</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Se souvenir de moi" />
                    <Form.Text className="text-muted">Rester identifié.e après fermeture de navigateur</Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={onSendCodeButtonClick}>
                    {isCodeLoading && <Spinner animation="grow" size="sm" />} Envoyer code
                </Button>
            </Form>
            {isCodeSent && (
                <Form>
                    <h4 className="mt-4">Votre code reçu par courriel :</h4>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Code reçu</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faInputNumeric} />
                            </InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="1234"
                                value={emailField}
                                onChange={({ target: { value } }) => setEmailField(value)}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">Le code que vous avez reçu par e-mail</Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={onLoginButtonClick}>
                        Connexion
                    </Button>
                </Form>
            )}
        </Container>
    )
}
