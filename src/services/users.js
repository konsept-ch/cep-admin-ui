// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { cookies } from '../utils'
import { MIDDLEWARE_URL } from '../constants/config'

// Define a service using a base URL and expected endpoints
export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: MIDDLEWARE_URL,
        prepareHeaders: (headers) => {
            headers.set('Access-Control-Allow-Origin', '*')
            headers.set('x-login-email-address', cookies.get('email'))
            headers.set('x-login-email-code', cookies.get('code'))
            headers.set('x-login-token', cookies.get('token'))
            return headers
        },
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => `allUsers`,
        }),
        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `user/${id}`,
                method: 'PUT',
                body,
            }),
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUsersQuery, useUpdateUserMutation } = usersApi
