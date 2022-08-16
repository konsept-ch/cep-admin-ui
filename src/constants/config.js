export const MIDDLEWARE_URL = process.env.REACT_APP_SERVICES_URL ?? 'http://localhost:4000'
// export const MIDDLEWARE_URL =
//     process.env.NODE_ENV === 'production' ? `${window.location.origin}/api/v1/` : 'http://localhost:4000/api/v1/'

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
