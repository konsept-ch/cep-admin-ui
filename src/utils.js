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
