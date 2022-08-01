import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const sessionsApi = createApi({
    reducerPath: 'sessionsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'sessions' }),
    endpoints: (builder) => ({
        getSessions: builder.query({
            query: () => '',
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

export const { useGetSessionsQuery, useUpdateSessionMutation, useGetSeancesQuery } = sessionsApi
