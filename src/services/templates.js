import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const templatesApi = createApi({
    reducerPath: 'templatesApi',
    baseQuery: prepareBaseQuery({ path: 'templates' }),
    endpoints: (builder) => ({
        getTemplates: builder.query({
            query: () => '',
        }),
        getMinimumTemplates: builder.query({
            query: () => 'minimum',
        }),
        createTemplate: builder.mutation({
            query: () => ({
                url: '',
                method: 'POST',
            }),
        }),
        updateTemplate: builder.mutation({
            query: ({ uuid, data }) => ({
                url: uuid,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteTemplate: builder.mutation({
            query: ({ uuid }) => ({
                url: uuid,
                method: 'DELETE',
            }),
        }),
        inviteTemplate: builder.mutation({
            query: ({ uuid }) => ({
                url: `${uuid}/invite`,
                method: 'POST',
            }),
        }),
        getTemplate: builder.query({
            query: ({ uuid }) => `${uuid}`,
        }),
        getTemplatePreview: builder.query({
            query: ({ template, session, inscription }) => `${template}/previews/${session}/${inscription}`,
        }),
    }),
})

export const {
    useGetTemplatesQuery,
    useGetMinimumTemplatesQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
    useInviteTemplateMutation,
    useLazyGetTemplateQuery,
    useLazyGetTemplatePreviewQuery,
} = templatesApi
