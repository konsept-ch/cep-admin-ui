import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const evaluationsApi = createApi({
    reducerPath: 'evaluationsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'evaluations' }),
    endpoints: (builder) => ({
        getEvaluations: builder.query({
            query: () => '',
        }),
    }),
})

export const { useGetEvaluationsQuery } = evaluationsApi
