import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { MIDDLEWARE_URL } from '../constants/config'
import { cookies } from '../utils'

export function* callService({ endpoint, action, successCallback = () => {}, options = {} }) {
    try {
        let result
        try {
            result = yield fetch(new URL(endpoint, MIDDLEWARE_URL).href, {
                ...options,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'x-login-email-address': cookies.get('email'),
                    'x-login-email-code': cookies.get('code'),
                    'x-login-token': cookies.get('token'),
                    ...options.headers,
                },
            })
        } catch (error) {
            console.error(error)
            toast.error(
                <>
                    <p>Erreur de URL - vous devez utiliser HTTPS</p>
                </>,
                { autoClose: false }
            )

            const RetryToast = () => (
                <div>
                    Erreur de URL
                    {window.location.protocol === 'http:' && (
                        <>
                            {' '}
                            - vous devez utiliser HTTPS
                            <Button
                                className="d-block mb-1"
                                variant="primary"
                                onClick={() => {
                                    window.location.protocol = 'https:'
                                }}
                            >
                                <FontAwesomeIcon icon={faRotateRight} /> Utiliser HTTPS
                            </Button>
                        </>
                    )}
                </div>
            )

            toast(<RetryToast />, { autoClose: false })
        }

        if (result.status !== 200) {
            const { message, stack, error } = yield result.json()

            /* eslint-disable-next-line no-console */
            console.error(stack)

            toast.error(
                <>
                    <p>{`${result.status} - ${result.statusText}`}</p>
                    <p>{message ?? error}</p>
                </>,
                { autoClose: false }
            )
            return
        }

        const resultJson = yield result.json()

        successCallback()

        return resultJson
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error(error.message)

        toast.error(
            <>
                <p>Middleware hors service ou en redéploiement.</p>
                <p>Message: {error.message}</p>
            </>,
            { autoClose: false, toastId: 'middleware-is-down' }
        )

        const RetryToast = ({ retryAction, closeToast }) => {
            const dispatch = useDispatch()
            return (
                <div>
                    Retry fetching {endpoint}
                    <Button
                        className="d-block mb-1"
                        variant="primary"
                        onClick={() => {
                            dispatch(retryAction)
                            closeToast()
                        }}
                    >
                        <FontAwesomeIcon icon={faRotateRight} /> Retry
                    </Button>
                </div>
            )
        }

        toast(({ closeToast }) => <RetryToast retryAction={action} closeToast={closeToast} />, { autoClose: false })
    }
}
