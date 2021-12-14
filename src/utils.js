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
    NOM_DU_PARTICIPANT: '[NOM_DU_PARTICIPANT]',
    NOM_DE_LA_SESSION: '[NOM_DE_LA_SESSION]',
    DATE_DE_DÉBUT: '[DATE_DE_DÉBUT]',
    LIEU: '[LIEU]',
}

export const replacePlaceholders = ({
    userFullName,
    sessionName,
    startDate,
    location,
    template: { body, emailSubject },
}) => {
    const placeholdersMapper = {
        [draftVariables.NOM_DU_PARTICIPANT]: userFullName,
        [draftVariables.NOM_DE_LA_SESSION]: sessionName,
        [draftVariables.DATE_DE_DÉBUT]: startDate,
        [draftVariables.LIEU]: location,
    }

    let enrichedEmailContent = body

    let enrichedEmailSubject = emailSubject

    Object.entries(placeholdersMapper).forEach(([placeholder, value]) => {
        if (body.includes(placeholder)) {
            enrichedEmailContent = enrichedEmailContent.replaceAll(placeholder, value)
        }

        if (emailSubject.includes(placeholder)) {
            enrichedEmailSubject = enrichedEmailSubject.replaceAll(placeholder, value)
        }
    })

    return { emailContent: enrichedEmailContent, emailSubject: enrichedEmailSubject }
}

export const formatDate = (dateString, isTimeVisible) => {
    const date = new Date(dateString)
    const getDay = () => (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate())
    const getMonth = () => {
        const month = date.getMonth() + 1
        return month < 10 ? `0${month}` : month
    }
    const getMinutes = () => {
        return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }
    const getTime = () => (isTimeVisible === true ? `, ${date.getHours()}h${getMinutes()}` : '')

    return `${getDay()}.${getMonth()}.${date.getFullYear()}${getTime()}`
}
