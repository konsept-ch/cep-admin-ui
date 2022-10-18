import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const contractsApi = createApi({
    reducerPath: 'contractsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'contracts' }),
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
            query: ({ uuid, shouldForceDelete }) => ({
                url: uuid,
                params: { shouldForceDelete },
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useGetContractsQuery,
    useCreateContractMutation,
    useUpdateContractMutation,
    useDeleteContractMutation,
} = contractsApi
