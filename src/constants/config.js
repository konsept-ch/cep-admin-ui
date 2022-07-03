export const MIDDLEWARE_URL =
    process.env.REACT_APP_MIDDLEWARE_URL ??
    (process.env.NODE_ENV === 'production' ? 'https://middleware.cep.swiss' : 'http://localhost:4000')

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
