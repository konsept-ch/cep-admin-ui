// Values can be injected at build time (CRA env vars).
const DEFAULT_ADMIN_VERSION = '2.1.7rc3'
const DEFAULT_FORMER_VERSION = 'unknown'

export const ADMIN_VERSION = process.env.REACT_APP_ADMIN_VERSION || DEFAULT_ADMIN_VERSION
export const FORMER_VERSION = process.env.REACT_APP_FORMER_VERSION || DEFAULT_FORMER_VERSION
