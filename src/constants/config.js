export const MIDDLEWARE_URL =
    process.env.REACT_APP_MIDDLEWARE_URL ??
    (process.env.NODE_ENV === 'production' ? 'https://middleware.cep-val.ch' : 'http://localhost:4000')
