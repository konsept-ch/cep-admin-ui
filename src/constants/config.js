export const MIDDLEWARE_URL =
    process.env.REACT_APP_SERVICES_URL ??
    (process.env.NODE_ENV === 'production' ? 'http://localhost:4000' : 'http://localhost:4000')
// (process.env.NODE_ENV === 'production' ? 'https://middleware.cep-val.ch' : 'http://localhost:4000')

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
