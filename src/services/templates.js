import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const templatesApi = createApi({
    reducerPath: 'templatesApi',
    baseQuery: prepareBaseQuery({ servicePath: 'templates' }),
    endpoints: (builder) => ({
        getTemplates: builder.query({
            query: () => '',
        }),
    }),
})

export const { useGetTemplatesQuery } = templatesApi
