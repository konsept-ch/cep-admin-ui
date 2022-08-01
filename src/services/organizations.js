import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const organizationsApi = createApi({
    reducerPath: 'organizationsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'organizations' }),
    endpoints: (builder) => ({
        getOrganizations: builder.query({
            query: () => '',
        }),
        updateOrganization: builder.mutation({
            query: ({ id, body }) => ({
                url: id,
                method: 'PUT',
                body,
            }),
        }),
    }),
})

export const { useGetOrganizationsQuery, useUpdateOrganizationMutation } = organizationsApi
