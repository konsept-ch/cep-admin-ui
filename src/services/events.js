import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: prepareBaseQuery({ servicePath: 'events' }),
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: () => '',
        }),
        updateEvent: builder.mutation({
            query: ({ uuid, fees, isFeesPaid }) => ({
                url: uuid,
                method: 'PUT',
                body: {
                    fees,
                    isFeesPaid,
                },
            }),
        }),
    }),
})

export const { useGetEventsQuery, useUpdateEventMutation } = eventsApi
