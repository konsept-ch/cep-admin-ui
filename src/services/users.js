import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: prepareBaseQuery({ servicePath: 'users' }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '',
        }),
        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: id,
                method: 'PUT',
                body,
            }),
        }),
        getAdmins: builder.query({
            query: () => 'admins',
        }),
    }),
})

export const { useGetUsersQuery, useLazyGetUsersQuery, useUpdateUserMutation, useGetAdminsQuery } = usersApi
