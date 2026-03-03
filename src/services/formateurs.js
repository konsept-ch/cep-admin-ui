import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const formateursApi = createApi({
    reducerPath: 'formateursApi',
    baseQuery: prepareBaseQuery({ path: 'inscriptions/formateurs' }),
    endpoints: (builder) => ({
        getFormateurs: builder.query({
            query: () => '',
        }),
        updateFormateur: builder.mutation({
            query: ({ uuid, data }) => ({
                url: uuid,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
})

export const { useGetFormateursQuery, useLazyGetFormateursQuery, useUpdateFormateurMutation } = formateursApi
