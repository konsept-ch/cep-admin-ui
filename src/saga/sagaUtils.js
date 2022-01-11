import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/pro-regular-svg-icons'
import { MIDDLEWARE_URL } from '../constants/config'
import { formatDate } from '../utils'

export function* callService({ endpoint, action, options = {} }) {
    try {
        const result = yield fetch(`${MIDDLEWARE_URL}/${endpoint}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            ...options,
        })

        if (result.status !== 200) {
            const resultText = yield result.text()
            toast.error(
                <>
                    <p>{`${result.status} - ${result.statusText}`}</p>
                    <p>{`${resultText}`}</p>
                </>,
                { autoClose: false }
            )
            yield fetch(`${MIDDLEWARE_URL}/reportError`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ date: formatDate({ dateString: new Date() }), errorDescription: resultText }),
            })

            return
        }

        const resultJson = yield result.json()

        return resultJson
    } catch (error) {
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
