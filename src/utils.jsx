import Cookies from 'universal-cookie'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/pro-regular-svg-icons'
import { MIDDLEWARE_URL } from './constants/config'

export const cookies = new Cookies()

export const clearAllAuthCookies = () => {
    cookies.remove('rememberMe')
    cookies.remove('isLoggedIn')
    cookies.remove('email')
    cookies.remove('code')
    cookies.remove('token')
}

export const keepAuthAlive = ({ path, maxAge }) => {
    cookies.set('rememberMe', cookies.get('rememberMe'), { path, maxAge })
    cookies.set('isLoggedIn', cookies.get('isLoggedIn'), { path, maxAge })
    cookies.set('email', cookies.get('email'), { path, maxAge })
    cookies.set('code', cookies.get('code'), { path, maxAge })
    cookies.set('token', cookies.get('token'), { path, maxAge })
}

export const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
}

export const mapEventTypeToClassName = ({ type }) =>
    ({
        f2f: 'presence-course',
        sync: 'online-sync',
        async: 'online-async',
    }[type])

export const mapClassNameToEventType = ({ className }) =>
    ({
        'presence-course': 'f2f',
        'online-sync': 'sync',
        'online-async': 'async',
    }[className])

export const STATUSES = {
    A_TRAITER_PAR_RH: 'À traiter par RH',
    VALIDE_PAR_RH: 'Validée par RH',
    REFUSEE_PAR_RH: 'Réfusée par RH',
    EN_ATTENTE: 'En attente',
    ENTREE_WEB: 'Entrée Web',
    ACCEPTEE_PAR_CEP: 'Acceptée par CEP',
    REFUSEE_PAR_CEP: 'Refusée par CEP',
    PROPOSEE: 'Proposée',
    INVITEE: 'Invitée',
    PARTICIPATION: 'Participation',
    PARTICIPATION_PARTIELLE: 'Participation Partielle',
    NON_PARTICIPATION: 'Non-participation',
    ANNULEE: 'Annulée',
    ECARTEE: 'Écartée',
}

export const FINAL_STATUSES = [
    STATUSES.A_TRAITER_PAR_RH,
    STATUSES.REFUSEE_PAR_RH,
    STATUSES.EN_ATTENTE,
    STATUSES.REFUSEE_PAR_CEP,
    STATUSES.ANNULEE,
    STATUSES.ECARTEE,
]

export const UNSELECTABLE_STATUSES = [
    STATUSES.A_TRAITER_PAR_RH,
    STATUSES.VALIDE_PAR_RH,
    STATUSES.REFUSEE_PAR_RH,
    STATUSES.EN_ATTENTE,
]

export const INVOICE_STATUSES = [STATUSES.PARTICIPATION, STATUSES.PARTICIPATION_PARTIELLE, STATUSES.NON_PARTICIPATION]

export const statusWarnings = {
    [STATUSES.ECARTEE]: {
        [STATUSES.ACCEPTEE_PAR_CEP]:
            "Vous êtes en train de changer le de 'Écartée' à 'Acceptée', mais c'est probablement mieux de créer une nouvelle inscription",
    },
}

export const getUniqueId = () => {
    const dateString = Date.now().toString(36)
    const randomness = Math.random().toString(36).substr(2)
    return dateString + randomness
}

export const inscriptionStatuses = Object.values(STATUSES)

export const draftVariables = {
    PARTICIPANT_NOM: '[PARTICIPANT_NOM]',
    SESSION_NOM: '[SESSION_NOM]',
    SESSION_DATE_DÉBUT: '[SESSION_DATE_DÉBUT]',
    LIEU: '[LIEU]',
    SESSION_RÉSUMÉ_DATES: '[SESSION_RÉSUMÉ_DATES]',
    PARTICIPANT_CIVILITÉ: '[PARTICIPANT_CIVILITÉ]',
    INSCRIPTION_DATE: '[INSCRIPTION_DATE]',
}

export const formatDate = ({ dateString, isTimeVisible, isDateVisible }) => {
    if (dateString == null) {
        return
    }

    const date = new Date(dateString)
    const getDay = () => (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate())
    const getMonth = () => {
        const month = date.getMonth() + 1
        return month < 10 ? `0${month}` : month
    }
    const getMinutes = () => {
        return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }
    const getDate = () => (isDateVisible === true ? `${getDay()}.${getMonth()}.${date.getFullYear()}` : null)
    const getTime = () => (isTimeVisible === true ? `${date.getHours()}h${getMinutes()}` : null)

    return [getDate(), getTime()].filter(Boolean).join(', ')
}

export const callApi = async ({ path = '', method = 'GET', headers, body, successCallback = () => {} }) => {
    try {
        const response = await fetch(new URL(path, MIDDLEWARE_URL).href, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'x-login-email-address': cookies.get('email'),
                'x-login-email-code': cookies.get('code'),
                'x-login-token': cookies.get('token'),
                ...headers,
            },
            method,
            body,
        })

        if (response.status !== 200) {
            const { message, stack } = await response.json()

            /* eslint-disable-next-line no-console */
            console.error(stack)

            toast.error(
                <>
                    <p>{`${response.status} - ${response.statusText}`}</p>
                    <p>{message}</p>
                </>,
                { autoClose: false }
            )
            fetch(new URL('reportError', MIDDLEWARE_URL).href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ errorDescription: message }),
            })

            return
        }

        const resultJson = response.json()

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

        const RetryToast = ({ closeToast }) => {
            return (
                <div>
                    Réessayer l'action
                    <Button
                        className="d-block mb-1"
                        variant="primary"
                        onClick={() => {
                            callApi({ path, method, headers, body, successCallback })
                            closeToast()
                        }}
                    >
                        <FontAwesomeIcon icon={faRotateRight} /> Réessayer
                    </Button>
                </div>
            )
        }

        toast(({ closeToast }) => <RetryToast closeToast={closeToast} />, {
            autoClose: false,
            toastId: `retry-${path}`,
        })
    }
}
export const inscriptionsGridRowClassRules = {
    'inscription-row-highlight': ({ data: { inscriptionDate, startDate, status } = {} }) => {
        const milisecondsIn5days = 1000 * 60 * 60 * 24 * 5
        const isSession5daysAfterInscription =
            new Date(startDate).getTime() - new Date(inscriptionDate).getTime() <= milisecondsIn5days

        const isInscriptionIncoming = status === STATUSES.ENTREE_WEB || status === STATUSES.A_TRAITER_PAR_RH

        return isSession5daysAfterInscription && isInscriptionIncoming
    },
}

export const gridContextMenu = [
    'autoSizeAll',
    'expandAll',
    'contractAll',
    'copy',
    'copyWithHeaders',
    'paste',
    'resetColumns',
    'export',
    'chartRange',
]

export const inscriptionsGridColumnDefs = [
    'autoSizeAll',
    'expandAll',
    'contractAll',
    'copy',
    'copyWithHeaders',
    'paste',
    'resetColumns',
    'export',
    'chartRange',
]

export const formatToFlatObject = (data) => {
    const objectValuesEntries = Object.entries(data)
        .filter(([_k, v]) => typeof v === 'object' && !Array.isArray(v) && v !== null)
        .reduce((acc, [k, v]) => {
            acc[k] = v.label
            return acc
        }, {})

    return { ...data, ...objectValuesEntries }
}

export const downloadCsvFile = ({ csv, fileName }) => {
    const blob = new Blob([csv], { type: 'text/csv' })

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.setAttribute('href', url)

    a.setAttribute('download', `${fileName}.txt`)

    a.click()
    a.remove()
}
