import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: prepareBaseQuery({ servicePath: 'auth' }),
    endpoints: (builder) => ({
        sendCode: builder.mutation({
            query: (data) => ({
                url: 'sendCode',
                method: 'POST',
                body: data,
            }),
        }),
        checkCodeAndToken: builder.mutation({
            query: (data) => ({
                url: 'checkCodeAndToken',
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

export const { useSendCodeMutation, useCheckCodeAndTokenMutation } = authApi
