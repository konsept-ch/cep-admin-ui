import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const inscriptionsApi = createApi({
    reducerPath: 'inscriptionsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'inscriptions' }),
    endpoints: (builder) => ({
        getInscriptionsAnnulations: builder.query({
            query: () => 'annulations',
        }),
    }),
})

export const { useGetInscriptionsAnnulationsQuery } = inscriptionsApi
