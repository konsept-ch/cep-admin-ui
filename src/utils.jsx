import Cookies from 'universal-cookie'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
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
    ANNULEE: 'Annulation à traiter',
    ANNULEE_FACTURABLE: 'Annulée facturable',
    ANNULEE_NON_FACTURABLE: 'Annulée non-facturable',
    ECARTEE: 'Écartée',
}

export const FINAL_STATUSES = [
    STATUSES.A_TRAITER_PAR_RH,
    STATUSES.REFUSEE_PAR_RH,
    STATUSES.EN_ATTENTE,
    STATUSES.REFUSEE_PAR_CEP,
    STATUSES.PARTICIPATION,
    STATUSES.PARTICIPATION_PARTIELLE,
    STATUSES.NON_PARTICIPATION,
    STATUSES.ANNULEE,
    STATUSES.ANNULEE_FACTURABLE,
    STATUSES.ANNULEE_NON_FACTURABLE,
    STATUSES.ECARTEE,
]

export const UNSELECTABLE_STATUSES = [
    STATUSES.A_TRAITER_PAR_RH,
    STATUSES.VALIDE_PAR_RH,
    STATUSES.REFUSEE_PAR_RH,
    STATUSES.EN_ATTENTE,
    STATUSES.ANNULEE,
]

export const lockGroups = [
    [
        STATUSES.PARTICIPATION,
        STATUSES.PARTICIPATION_PARTIELLE,
        STATUSES.NON_PARTICIPATION,
        STATUSES.ANNULEE,
        STATUSES.ANNULEE_FACTURABLE,
        STATUSES.ANNULEE_NON_FACTURABLE,
    ],
]

export const INVOICE_STATUSES = [STATUSES.PARTICIPATION, STATUSES.PARTICIPATION_PARTIELLE, STATUSES.NON_PARTICIPATION]

export const statusWarnings = {
    [STATUSES.ECARTEE]: {
        [STATUSES.ACCEPTEE_PAR_CEP]:
            "Vous êtes en train de changer le de 'Écartée' à 'Acceptée', mais c'est probablement mieux de créer une nouvelle inscription",
    },
}

export const checkAreInSameLockGroup = (status1) => (status2) =>
    lockGroups.some((lockGroup) => lockGroup.includes(status1) && lockGroup.includes(status2))

export const inscriptionStatuses = Object.values(STATUSES)

export const formatDate = ({ dateString, isTimeVisible, isDateVisible }) => {
    if (dateString == null) {
        return ''
    }

    const date = new Date(dateString)
    return `${
        isDateVisible
            ? `${date.getDate() < 10 ? '0' : ''}${date.getDate()}.${date.getMonth() < 9 ? '0' : ''}${
                  date.getMonth() + 1
              }.${date.getFullYear()}`
            : ''
    }${
        isTimeVisible
            ? `${isDateVisible ? ', ' : ''}${date.getHours()}h${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
            : ''
    }`
}

export const callApi = async ({ path = '', method = 'GET', headers, body, successCallback = () => {} }) => {
    try {
        // let response
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
                const { message, stack, error } = await response.json()

                /* eslint-disable-next-line no-console */
                console.error(stack)

                toast.error(
                    <>
                        <p>{`${response.status} - ${response.statusText}`}</p>
                        <p>{message ?? error}</p>
                    </>,
                    { autoClose: false }
                )

                return
            }

            const resultJson = response.json()

            successCallback()

            return resultJson
        } catch (error) {
            console.error(error)

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
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error(error?.message)

        toast.error(
            <>
                <p>Middleware hors service ou en redéploiement.</p>
                <p>Message: {error?.message}</p>
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
    // TODO: fix encoding, ANSI
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: 'text/csv;charset=utf-8' })

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.setAttribute('href', url)

    a.setAttribute('download', `${fileName}.csv`)

    a.click()
    a.remove()
}

export const gotoUrl = (url) => {
    const a = document.createElement('a')
    a.setAttribute('target', '_blank')
    a.setAttribute('href', url)
    a.click()
    a.remove()
}
