import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const contractsApi = createApi({
    reducerPath: 'contractsApi',
    baseQuery: prepareBaseQuery({ path: 'contracts' }),
    endpoints: (builder) => ({
        downloadContract: builder.query({
            async queryFn({ contractId }, _queryApi, _extraOptions, fetchWithBQ) {
                await fetchWithBQ({
                    url: contractId,
                    method: 'get',
                    responseHandler: async (response) =>
                        window.location.assign(window.URL.createObjectURL(await response.blob())),
                })
                return {
                    data: undefined,
                }
            },
        }),
        updateContract: builder.mutation({
            query: ({ userId, courseId, templateId, year }) => ({
                url: '',
                method: 'PUT',
                body: {
                    userId,
                    courseId,
                    templateId,
                    year,
                },
            }),
        }),
    }),
})

export const { useLazyDownloadContractQuery, useCreateContractMutation, useUpdateContractMutation } = contractsApi
