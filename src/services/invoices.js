import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const invoicesApi = createApi({
    reducerPath: 'invoicesApi',
    baseQuery: prepareBaseQuery({ servicePath: 'invoices' }),
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: () => '',
        }),
        getManualInvoices: builder.query({
            query: () => 'manual',
        }),
        createManualInvoice: builder.mutation({
            query: ({ body }) => ({
                url: `manual`,
                method: 'POST',
                body,
            }),
        }),
        updateInvoice: builder.mutation({
            query: ({ id, body }) => ({
                url: id,
                method: 'PUT',
                body,
            }),
        }),
        updateManualInvoice: builder.mutation({
            query: ({ id, body }) => ({
                url: `manual/${id}`,
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
        removeManualInvoice: builder.mutation({
            query: ({ id }) => ({
                url: `manual/${id}`,
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
    useGetManualInvoicesQuery,
    useCreateManualInvoiceMutation,
    useUpdateInvoiceMutation,
    useUpdateManualInvoiceMutation,
    useRemoveInvoiceMutation,
    useRemoveManualInvoiceMutation,
    useCreateGroupedBiannualInvoicesMutation,
} = invoicesApi
