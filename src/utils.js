import cogoToast from 'cogo-toast'
import { MIDDLEWARE_URL } from './constants/config'

export const transformFlagsToStatus = ({ validated, confirmed }) => {
    if (!confirmed) {
        return 'Proposée'
    } else if (!validated) {
        return 'En attente'
    } else {
        return 'Entrée web'
    }
}

export const callService = async (endpoint, options = {}) => {
    try {
        const result = await fetch(`${MIDDLEWARE_URL}/${endpoint}`, options)
        const resultText = await result.text()

        if (result.status !== 200) {
            cogoToast.error(
                <>
                    <p>{`${result.status} - ${result.statusText}`}</p>
                    <p>{`${resultText}`}</p>
                </>
            )
            await fetch(`${MIDDLEWARE_URL}/reportError`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: new Date(), errorDescription: resultText }),
            })

            return
        }

        return await result.json()
    } catch (error) {
        cogoToast.error(error.message)
    }
}
