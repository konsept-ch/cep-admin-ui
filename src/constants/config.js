const mapCurrentUrlToEnv = {
    'https://former22.cep.swiss': 'prod',
    'https://former22.cep-val.ch': 'val',
    'http://localhost:3000': 'local',
    'http://127.0.0.1:3000': 'local',
    'https://former22.dgcs.cep.swiss': 'dgcs-prod',
    'https://former22.dgcs.cep-val.ch': 'dgcs-val',
    'https://former22.cffe.cep.swiss': 'cffe-prod',
    'https://former22.cffe.cep-val.ch': 'cffe-val',
}
const mapCurrentEnvToMiddlewareUrl = {
    prod: 'https://middleware.cep.swiss',
    val: 'https://middleware.cep-val.ch',
    local: 'http://localhost:4000',
    'dgcs-prod': 'https://middleware.dgcs.cep.swiss',
    'dgcs-val': 'https://middleware.dgcs.cep-val.ch',
    'cffe-prod': 'https://middleware.cffe.cep.swiss',
    'cffe-val': 'https://middleware.cffe.cep-val.ch',
}

export const currentRunningEnv = mapCurrentUrlToEnv[window.location.origin] ?? 'other'

export const MIDDLEWARE_URL = mapCurrentEnvToMiddlewareUrl[currentRunningEnv]

// export const MIDDLEWARE_URL =
//     process.env.NODE_ENV === 'production' ? `${window.location.origin}/api/v1/` : 'http://localhost:4000/api/v1/'

export const isDev = process.env.NODE_ENV === 'development'

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
