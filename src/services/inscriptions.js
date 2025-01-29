import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const inscriptionsApi = createApi({
    reducerPath: 'inscriptionsApi',
    baseQuery: prepareBaseQuery({ path: 'inscriptions' }),
    endpoints: (builder) => ({
        getInscriptions: builder.query({
            query: () => '',
        }),
        updateOrganization: builder.mutation({
            query: ({ inscriptionId, organizationId }) => ({
                url: `${inscriptionId}/organization`,
                method: 'PUT',
                body: {
                    organizationId,
                },
            }),
        }),
        updateInscriptionStatus: builder.mutation({
            query: ({
                inscriptionId,
                newStatus,
                emailTemplateId,
                selectedAttestationTemplateUuid,
                shouldSendSms,
                remark,
            }) => ({
                url: inscriptionId,
                method: 'PUT',
                body: {
                    status: newStatus,
                    emailTemplateId,
                    selectedAttestationTemplateUuid,
                    shouldSendSms,
                    remark,
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
    useGetInscriptionsQuery,
    useGetInscriptionCancellationsQuery,
    useGetInscriptionsRefusedByHrQuery,
    useUpdateOrganizationMutation,
    useUpdateInscriptionStatusMutation,
} = inscriptionsApi
