const mapCurrentUrlToEnv = {
    'https://former22.dgcs.swiss': 'prod',
    'https://former22.dgcs-val.ch': 'val',
    'http://localhost:3000': 'local',
    'http://127.0.0.1:3000': 'local',
    'https://former22.formationdgcs.ch': 'dgcs-prod',
    'https://former22.cffe.dgcs.swiss': 'cffe-prod',
    'https://former22.cffe.dgcs-val.ch': 'cffe-val',
}
const mapCurrentEnvToMiddlewareUrl = {
    prod: 'https://middleware.dgcs.swiss',
    val: 'https://middleware.dgcs-val.ch',
    local: 'http://localhost:4000',
    'dgcs-prod': 'https://middleware.formationdgcs.ch',
    'cffe-prod': 'https://middleware.cffe.dgcs.swiss',
    'cffe-val': 'https://middleware.cffe.dgcs-val.ch',
}

export const currentRunningEnv = mapCurrentUrlToEnv[window.location.origin] ?? 'other'

export const MIDDLEWARE_URL = mapCurrentEnvToMiddlewareUrl[currentRunningEnv]

// export const MIDDLEWARE_URL =
//     process.env.NODE_ENV === 'production' ? `${window.location.origin}/api/v1/` : 'http://localhost:4000/api/v1/'

export const isDev = process.env.NODE_ENV === 'development'

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
