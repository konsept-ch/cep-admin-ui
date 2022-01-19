import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/pro-regular-svg-icons'
import { MIDDLEWARE_URL } from '../constants/config'
import { cookies, formatDate } from '../utils'

export function* callService({ endpoint, action, successCallback = () => {}, options = {} }) {
    try {
        const result = yield fetch(`${MIDDLEWARE_URL}/${endpoint}`, {
            ...options,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'x-login-email-address': cookies.get('email'),
                'x-login-email-code': cookies.get('code'),
                'x-login-token': cookies.get('token'),
                ...options.headers,
            },
        })

        if (result.status !== 200) {
            const { message, stack } = yield result.json()

            /* eslint-disable-next-line no-console */
            console.error(stack)

            toast.error(
                <>
                    <p>{`${result.status} - ${result.statusText}`}</p>
                    <p>{message}</p>
                </>,
                { autoClose: false }
            )
            yield fetch(`${MIDDLEWARE_URL}/reportError`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ date: formatDate({ dateString: new Date() }), errorDescription: message }),
            })

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
                <p>Middleware is down or being redeployed. Please, retry in a minute.</p>
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
