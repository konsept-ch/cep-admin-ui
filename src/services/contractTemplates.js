import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const contractTemplatesApi = createApi({
    reducerPath: 'contractTemplatesApi',
    baseQuery: prepareBaseQuery({ path: 'contract-templates' }),
    endpoints: (builder) => ({
        getContracts: builder.query({
            query: () => '',
        }),
        createContract: builder.mutation({
            query: () => ({
                url: '',
                method: 'POST',
            }),
        }),
        updateContract: builder.mutation({
            query: ({ uuid, formData }) => ({
                url: uuid,
                method: 'PUT',
                body: formData,
            }),
        }),
        deleteContract: builder.mutation({
            query: ({ uuid }) => ({
                url: uuid,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useGetContractsQuery, useCreateContractMutation, useUpdateContractMutation, useDeleteContractMutation } =
    contractTemplatesApi
