const mapCurrentUrlToEnv = {
    'https://former22.cep.swiss': 'prod',
    'https://former22.cep-val.ch': 'val',
    'http://localhost:3000': 'local',
}
const mapCurrentEnvToMiddlewareUrl = {
    prod: 'https://middleware.cep.swiss',
    val: 'https://middleware.cep-val.ch',
    local: 'http://localhost:4000',
}

export const currentRunningEnv = mapCurrentUrlToEnv[window.location.origin]

export const MIDDLEWARE_URL = mapCurrentEnvToMiddlewareUrl[currentRunningEnv]

// export const MIDDLEWARE_URL =
//     process.env.NODE_ENV === 'production' ? `${window.location.origin}/api/v1/` : 'http://localhost:4000/api/v1/'

export const isDev = process.env.NODE_ENV === 'development'

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
