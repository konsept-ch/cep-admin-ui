import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const agendaApi = createApi({
    reducerPath: 'agendaApi',
    baseQuery: prepareBaseQuery({ path: 'agenda' }),
    endpoints: (builder) => ({
        getAgenda: builder.query({
            query: () => '',
        }),
    }),
})

export const { useGetAgendaQuery } = agendaApi
