export const MIDDLEWARE_URL =
    window.location.origin === 'https://former22.cep.swiss'
        ? 'https://middleware.cep.swiss'
        : window.location.origin === 'https://former22.cep-val.ch'
        ? 'https://middleware.cep-val.ch'
        : 'http://localhost:4000'
// export const MIDDLEWARE_URL =
//     process.env.NODE_ENV === 'production' ? `${window.location.origin}/api/v1/` : 'http://localhost:4000/api/v1/'

export const isDev = process.env.NODE_ENV === 'development'

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
