import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const contractsApi = createApi({
    reducerPath: 'contractsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'contracts' }),
    endpoints: (builder) => ({
        updateContract: builder.mutation({
            query: ({ userId, courseId, templateId }) => ({
                url: '',
                method: 'PUT',
                body: {
                    userId,
                    courseId,
                    templateId,
                },
            }),
        }),
    }),
})

export const { useCreateContractMutation, useUpdateContractMutation } = contractsApi
