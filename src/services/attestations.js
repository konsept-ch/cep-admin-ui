import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const attestationsApi = createApi({
    reducerPath: 'attestationsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'attestations' }),
    endpoints: (builder) => ({
        getAttestations: builder.query({
            query: () => '',
        }),
        createAttestation: builder.mutation({
            query: ({ attestationData }) => ({
                url: '',
                method: 'POST',
                body: { ...attestationData },
            }),
        }),
    }),
})

export const { useGetAttestationsQuery, useCreateAttestationMutation } = attestationsApi
