import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const sessionsApi = createApi({
    reducerPath: 'sessionsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'sessions' }),
    endpoints: (builder) => ({
        getSessions: builder.query({
            query: () => '',
        }),
        getMinimalSessions: builder.query({
            query: () => 'minimal',
        }),
        getUsers: builder.query({
            query: ({ sessionId }) => `${sessionId}/users`,
        }),
        getPresenceList: builder.query({
            query: ({ sessionId }) => `presence-list/${sessionId}`,
        }),
        getSeances: builder.query({
            query: () => 'seances',
        }),
        updateSession: builder.mutation({
            query: ({ sessionId, sessionName, startDate, ...rest }) => ({
                url: sessionId,
                method: 'PUT',
                body: { sessionName, startDate, ...rest },
            }),
        }),
    }),
})

export const {
    useGetSessionsQuery,
    useGetMinimalSessionsQuery,
    useLazyGetUsersQuery,
    useUpdateSessionMutation,
    useGetSeancesQuery,
    useGetPresenceListQuery,
} = sessionsApi
