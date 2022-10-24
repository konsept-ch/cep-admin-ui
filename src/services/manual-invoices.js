import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const manualInvoicesApi = createApi({
    reducerPath: 'manualInvoicesApi',
    baseQuery: prepareBaseQuery({ servicePath: 'manual-invoices' }),
    endpoints: (builder) => ({
        getManualInvoices: builder.query({
            query: () => '',
        }),
        createManualInvoice: builder.mutation({
            query: ({ body }) => ({
                url: '',
                method: 'POST',
                body,
            }),
        }),
        updateManualInvoice: builder.mutation({
            query: ({ id, body }) => ({
                url: id,
                method: 'PUT',
                body,
            }),
        }),
        removeManualInvoice: builder.mutation({
            query: ({ id }) => ({
                url: id,
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useGetManualInvoicesQuery,
    useCreateManualInvoiceMutation,
    useUpdateManualInvoiceMutation,
    useRemoveManualInvoiceMutation,
} = manualInvoicesApi
