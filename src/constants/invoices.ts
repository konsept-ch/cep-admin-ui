import {
    PATH_INVOICE,
    PATH_INVOICE_ALL,
    PATH_INVOICE_DIRECT,
    PATH_INVOICE_GROUPED,
    PATH_INVOICE_MANUAL,
} from './constants'

export const mapPathnameToInvoiceType = {
    [`/${PATH_INVOICE}/${PATH_INVOICE_DIRECT}`]: 'Directe',
    [`/${PATH_INVOICE}/${PATH_INVOICE_GROUPED}`]: 'Groupée',
    [`/${PATH_INVOICE}/${PATH_INVOICE_MANUAL}`]: 'Manuelle',
    [`/${PATH_INVOICE}/${PATH_INVOICE_ALL}`]: null,
}
