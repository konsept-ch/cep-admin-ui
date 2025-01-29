import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const attestationsApi = createApi({
    reducerPath: 'attestationsApi',
    baseQuery: prepareBaseQuery({ path: 'attestations' }),
    endpoints: (builder) => ({
        getAttestations: builder.query({
            query: () => '',
        }),
        createAttestation: builder.mutation({
            query: () => ({
                url: '',
                method: 'POST',
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
            query: ({ uuid, shouldForceDelete }) => ({
                url: uuid,
                params: { shouldForceDelete },
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
