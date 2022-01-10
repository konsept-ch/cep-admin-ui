export const dateOptions = {
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
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

export const statuses = {
    EN_ATTENTE: 'En attente',
    A_TRAITER_PAR_RH: 'À traiter par RH',
    REFUSEE_PAR_RH: 'Réfusée par RH',
    ENTREE_WEB: 'Entrée Web',
    ACCEPTEE_PAR_CEP: 'Acceptée par CEP',
    INVITEE: 'Invitée',
    PROPOSEE: 'Proposée',
    ANNULEE: 'Annulée',
    ECARTEE: 'Écartée',
}

export const statusWarnings = {
    [statuses.ECARTEE]: {
        [statuses.ACCEPTEE_PAR_CEP]:
            "Vous êtes en train de changer le de 'Écartée' à 'Acceptée', mais c'est probablement mieux de créer une nouvelle inscription",
    },
}

export const getUniqueId = () => {
    const dateString = Date.now().toString(36)
    const randomness = Math.random().toString(36).substr(2)
    return dateString + randomness
}

export const inscriptionStatuses = Object.values(statuses)

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

export const isObjEmpty = (obj) => Object.keys(obj).length === 0
