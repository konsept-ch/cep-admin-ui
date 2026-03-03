import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const evaluationTemplatesApi = createApi({
    reducerPath: 'evaluationTemplatesApi',
    baseQuery: prepareBaseQuery({ path: 'evaluation-templates' }),
    endpoints: (builder) => ({
        getEvaluations: builder.query({
            query: () => '',
        }),
        createEvaluation: builder.mutation({
            query: () => ({
                url: '',
                method: 'POST',
            }),
        }),
        updateEvaluation: builder.mutation({
            query: ({ uuid, data, struct }) => ({
                url: uuid,
                method: 'PUT',
                body: {
                    ...data,
                    category: data.category.value,
                    struct,
                },
            }),
        }),
        deleteEvaluation: builder.mutation({
            query: ({ uuid, shouldForceDelete }) => ({
                url: uuid,
                params: { shouldForceDelete },
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useGetEvaluationsQuery,
    useCreateEvaluationMutation,
    useUpdateEvaluationMutation,
    useDeleteEvaluationMutation,
} = evaluationTemplatesApi
