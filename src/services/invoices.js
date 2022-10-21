import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const invoicesApi = createApi({
    reducerPath: 'invoicesApi',
    baseQuery: prepareBaseQuery({ servicePath: 'invoices' }),
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: () => '',
        }),
        updateInvoice: builder.mutation({
            query: ({ id, body }) => ({
                url: id,
                method: 'PUT',
                body,
            }),
        }),
        removeInvoice: builder.mutation({
            query: ({ id }) => ({
                url: id,
                method: 'DELETE',
            }),
        }),
        createGroupedBiannualInvoices: builder.mutation({
            query: () => ({
                url: 'biannual',
                method: 'POST',
            }),
        }),
    }),
})

export const {
    useGetInvoicesQuery,
    useUpdateInvoiceMutation,
    useRemoveInvoiceMutation,
    useCreateGroupedBiannualInvoicesMutation,
} = invoicesApi
