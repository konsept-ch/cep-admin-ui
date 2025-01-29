import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const tutorsApi = createApi({
    reducerPath: 'tutorsApi',
    baseQuery: prepareBaseQuery({ path: 'tutors' }),
    endpoints: (builder) => ({
        getTutors: builder.query({
            query: () => '',
        }),
        updateTutor: builder.mutation({
            query: ({ uuid, data }) => ({
                url: uuid,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
})

export const { useGetTutorsQuery, useLazyGetTutorsQuery, useUpdateTutorMutation } = tutorsApi
