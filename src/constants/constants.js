import {
    faInfinity,
    faFileInvoiceDollar,
    faObjectGroup,
    faHandHoldingDollar,
    faPersonCircleCheck,
} from '@fortawesome/pro-thin-svg-icons'

export const DATE_FORMAT_SWISS_FRENCH = 'fr-CH'
export const DATE_FORMAT_OPTIONS = {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
}

export const PATH_INSCRIPTIONS = 'inscriptions'
export const PATH_FORMATEURS = 'formateurs'
export const PATH_CATALOGUE = 'catalogue'
export const PATH_SESSIONS = 'sessions'
export const PATH_FORMATIONS = 'formations'
export const PATH_TEMPLATES = 'modeles'
export const PATH_EMAIL_TEMPLATES = 'email'
export const PATH_ATTESTATION_TEMPLATES = 'attestations'
export const PATH_CONTRACTS = 'contrats'
export const PATH_AGENDA = 'agenda'
export const PATH_NOTIFICATIONS = 'notifications'
export const PATH_COMMUNITY = 'community'
export const PATH_ORGANIZATIONS = 'organisations'
export const PATH_USERS = 'users'
export const PATH_INVOICE = 'invoices'
export const PATH_INVOICE_DIRECT = 'direct'
export const PATH_INVOICE_GROUPED = 'grouped'
export const PATH_INVOICE_MANUAL = 'manual'
export const PATH_INVOICE_ALL = 'all'
export const PATH_INVOICE_QUOTAS = 'quotas'
export const PATH_ANNULATIONS = 'annulations'
export const PATH_REFUSED_BY_HR = 'refused-by-hr'
export const PATH_SEANCES = 'seances'

export const splitComment = '<!-- AUTO -->'

export const mapPathnameToIcon = {
    [`/${PATH_INVOICE}/${PATH_INVOICE_DIRECT}`]: faFileInvoiceDollar,
    [`/${PATH_INVOICE}/${PATH_INVOICE_GROUPED}`]: faObjectGroup,
    [`/${PATH_INVOICE}/${PATH_INVOICE_MANUAL}`]: faHandHoldingDollar,
    [`/${PATH_INVOICE}/${PATH_INVOICE_ALL}`]: faInfinity,
    [`/${PATH_INVOICE}/${PATH_INVOICE_QUOTAS}`]: faPersonCircleCheck,
}
