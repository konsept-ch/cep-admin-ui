import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const inscriptionsApi = createApi({
    reducerPath: 'inscriptionsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'inscriptions' }),
    endpoints: (builder) => ({
        updateInscriptionStatus: builder.mutation({
            query: ({ inscriptionId, newStatus, emailTemplateId, selectedAttestationTemplateUuid, shouldSendSms }) => ({
                url: inscriptionId,
                method: 'PUT',
                body: {
                    status: newStatus,
                    emailTemplateId,
                    selectedAttestationTemplateUuid,
                    shouldSendSms,
                },
            }),
        }),
        getInscriptionCancellations: builder.query({
            query: () => 'cancellations',
        }),
        getInscriptionsRefusedByHr: builder.query({
            query: () => 'refused-by-hr',
        }),
    }),
})

export const {
    useGetInscriptionCancellationsQuery,
    useGetInscriptionsRefusedByHrQuery,
    useUpdateInscriptionStatusMutation,
} = inscriptionsApi
