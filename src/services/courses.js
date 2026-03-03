import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: prepareBaseQuery({ path: 'courses' }),
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: () => '',
        }),
        updateCourse: builder.mutation({
            query: ({ courseId, newData }) => ({
                url: courseId,
                method: 'PUT',
                body: { newData },
            }),
        }),
        addOrganizations: builder.mutation({
            query: () => ({
                url: 'addOrganizations',
                method: 'PUT',
            }),
        }),
        removeOrganizations: builder.mutation({
            query: () => ({
                url: 'removeOrganizations',
                method: 'PUT',
            }),
        }),
    }),
})

export const {
    useGetCoursesQuery,
    useUpdateCourseMutation,
    useAddOrganizationsMutation,
    useRemoveOrganizationsMutation,
} = coursesApi
