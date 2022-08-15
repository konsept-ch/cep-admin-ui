export const MIDDLEWARE_URL = process.env.REACT_APP_SERVICE_URL ?? '/api/v1'

console.log(process.env.REACT_APP_SERVICE_URL, MIDDLEWARE_URL)

export const authCookiesMaxAgeSeconds = { true: 43200, false: 60 }
