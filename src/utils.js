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

export const statusWarnings = {
    Écartée: {
        'Acceptée par CEP':
            "Vous êtes en train de changer le de 'Écartée' à 'Acceptée', mais c'est probablement mieux de créer une nouvelle inscription",
    },
}

export const getUniqueId = () => {
    const dateString = Date.now().toString(36)
    const randomness = Math.random().toString(36).substr(2)
    return dateString + randomness
}

export const inscriptionStatuses = [
    'En attente',
    'À traiter par RH',
    'Réfusée par RH',
    'Entrée Web',
    'Acceptée par CEP',
    'Invitée',
    'Proposée',
    'Annulée',
    'Écartée',
]

export const replacePlaceholders = ({ userFullName, sessionName, startDate, template: { body, emailSubject } }) => {
    const placeholdersMapper = {
        '[NOM_DU_PARTICIPANT]': userFullName,
        '[NOM_DE_LA_SESSION]': sessionName,
        '[DATE_DE_DÉBUT]': startDate,
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
    const getTime = () => (isTimeVisible === true ? `, ${date.getHours()}h${date.getMinutes()}` : '')

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}${getTime()}`
}
