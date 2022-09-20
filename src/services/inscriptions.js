import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const inscriptionsApi = createApi({
    reducerPath: 'inscriptionsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'inscriptions' }),
    endpoints: (builder) => ({
        getInscriptionCancellations: builder.query({
            query: () => 'cancellations',
        }),
        getInscriptionsRefusedByHr: builder.query({
            query: () => 'refused-by-hr',
        }),
    }),
})

export const { useGetInscriptionCancellationsQuery, useGetInscriptionsRefusedByHrQuery } = inscriptionsApi
