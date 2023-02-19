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
        generateGroupedInvoice: builder.mutation({
            query: ({ type }) => ({
                url: 'grouped',
                method: 'POST',
                body: { type },
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
    useGenerateGroupedInvoiceMutation,
} = manualInvoicesApi
