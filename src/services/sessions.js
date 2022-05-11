import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { cookies } from '../utils'
import { MIDDLEWARE_URL } from '../constants/config'

export const sessionsApi = createApi({
    reducerPath: 'sessionsApi',
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
        getSessions: builder.query({
            query: () => `sessions`,
        }),
        updateSession: builder.mutation({
            query: ({ sessionId, sessionName, startDate, ...rest }) => {
                return {
                    url: `sessions/${sessionId}`,
                    method: 'PUT',
                    body: { sessionName, startDate, ...rest },
                }
            },
        }),
    }),
})

export const { useGetSessionsQuery, useUpdateSessionMutation } = sessionsApi
