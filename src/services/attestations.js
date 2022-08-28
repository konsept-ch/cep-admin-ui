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
            query: () => ({
                url: '',
                method: 'POST',
                // body: { ...attestationData },
            }),
        }),
        updateAttestation: builder.mutation({
            query: ({ uuid, formData }) => ({
                url: uuid,
                method: 'PUT',
                body: formData,
            }),
        }),
        deleteAttestation: builder.mutation({
            query: ({ uuid }) => ({
                url: uuid,
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useGetAttestationsQuery,
    useCreateAttestationMutation,
    useUpdateAttestationMutation,
    useDeleteAttestationMutation,
} = attestationsApi
