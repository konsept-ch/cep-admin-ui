import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const organizationsApi = createApi({
    reducerPath: 'organizationsApi',
    baseQuery: prepareBaseQuery({ path: 'organizations' }),
    endpoints: (builder) => ({
        getOrganizationsFlat: builder.query({
            query: () => 'flat',
        }),
        getOrganizationsFlatWithAddress: builder.query({
            query: () => 'flat-with-address',
        }),
        getOrganizationsHierarchy: builder.query({
            query: () => 'hierarchy',
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

export const {
    useGetOrganizationsFlatQuery,
    useLazyGetOrganizationsFlatWithAddressQuery,
    useGetOrganizationsHierarchyQuery,
    useUpdateOrganizationMutation,
} = organizationsApi
