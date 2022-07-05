import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { cookies } from '../utils'
import { MIDDLEWARE_URL } from '../constants/config'

export const invoicesApi = createApi({
    reducerPath: 'invoicesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: MIDDLEWARE_URL,
        prepareHeaders: (headers) => {
            headers.set('Access-Control-Allow-Origin', '*')
            headers.set('x-login-email-address', cookies.get('email'))
            headers.set('x-login-email-code', cookies.get('code'))
            headers.set('x-login-token', cookies.get('token'))
            return headers
        },
    }),
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: () => `invoices`,
        }),
        getCresusData: builder.mutation({
            query: ({ invoiceId }) => ({
                url: `invoices/cresus/${invoiceId}`,
            }),
        }),
        updateInvoice: builder.mutation({
            query: ({ id, body }) => ({
                url: `invoice/${id}`,
                method: 'PUT',
                body,
            }),
        }),
        removeInvoice: builder.mutation({
            query: ({ id }) => ({
                url: `invoice/${id}`,
                method: 'DELETE',
            }),
        }),
        createGroupedBiannualInvoices: builder.mutation({
            query: () => ({
                url: `invoice/biannual`,
                method: 'POST',
            }),
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetInvoicesQuery,
    useGetCresusDataMutation,
    useUpdateInvoiceMutation,
    useRemoveInvoiceMutation,
    useCreateGroupedBiannualInvoicesMutation,
} = invoicesApi
