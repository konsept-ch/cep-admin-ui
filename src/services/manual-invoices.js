import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const manualInvoicesApi = createApi({
    reducerPath: 'manualInvoicesApi',
    baseQuery: prepareBaseQuery({ servicePath: 'manual-invoices' }),
    endpoints: (builder) => ({
        getEnums: builder.query({
            query: () => 'enums',
        }),
        updateStatuses: builder.mutation({
            query: ({ body }) => ({
                url: 'statuses',
                method: 'PUT',
                body,
            }),
        }),
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
        generateDirectInvoice: builder.mutation({
            query: () => ({
                url: 'direct',
                method: 'POST',
            }),
        }),
        generateGroupedInvoice: builder.mutation({
            query: () => ({
                url: 'grouped',
                method: 'POST',
            }),
        }),
        deleteAllInvoices: builder.mutation({
            query: () => ({
                url: 'all',
                method: 'delete',
            }),
        }),
    }),
})

export const {
    useGetEnumsQuery,
    useUpdateStatusesMutation,
    useGetManualInvoicesQuery,
    useCreateManualInvoiceMutation,
    useUpdateManualInvoiceMutation,
    useRemoveManualInvoiceMutation,
    useGenerateDirectInvoiceMutation,
    useGenerateGroupedInvoiceMutation,
    useDeleteAllInvoicesMutation,
} = manualInvoicesApi
