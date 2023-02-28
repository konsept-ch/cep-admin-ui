import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const evaluationsApi = createApi({
    reducerPath: 'evaluationsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'evaluations' }),
    endpoints: (builder) => ({
        getEvaluations: builder.query({
            query: () => '',
        }),
        getEvaluation: builder.query({
            query: (uuid) => uuid,
        }),
        getSessions: builder.query({
            query: () => 'sessions',
        }),
        createEvaluation: builder.mutation({
            query: (body) => ({
                method: 'POST',
                body,
            }),
        }),
        createEvaluationResult: builder.mutation({
            query: ({ uuid, result }) => ({
                url: `${uuid}/result`,
                method: 'POST',
                body: { result },
            }),
        }),
    }),
})

export const {
    useGetEvaluationsQuery,
    useGetEvaluationQuery,
    useGetSessionsQuery,
    useCreateEvaluationMutation,
    useCreateEvaluationResultMutation,
} = evaluationsApi
