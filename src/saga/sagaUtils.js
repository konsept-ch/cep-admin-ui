import { toast } from 'react-toastify'
import { MIDDLEWARE_URL } from '../constants/config'
import { formatDate } from '../utils'

export function* callService({ endpoint, options = {} }) {
    try {
        const result = yield fetch(`${MIDDLEWARE_URL}/${endpoint}`, options)

        if (result.status !== 200) {
            const resultText = yield result.text()
            toast.error(
                <>
                    <p>{`${result.status} - ${result.statusText}`}</p>
                    <p>{`${resultText}`}</p>
                </>,
                { hideAfter: 3 }
            )
            yield fetch(`${MIDDLEWARE_URL}/reportError`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: formatDate({ dateString: new Date() }), errorDescription: resultText }),
            })

            return
        }

        const resultJson = yield result.json()

        return resultJson
    } catch (error) {
        toast.error(error.message, { autoClose: false })
    }
}
