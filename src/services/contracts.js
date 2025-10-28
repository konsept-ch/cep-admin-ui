import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

export const resolveFilename = (contentDisposition) => {
    if (!contentDisposition) return null

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
    if (utf8Match) {
        try {
            return decodeURIComponent(utf8Match.replace(/['"]/g, ''))
        } catch (_error) {
            return utf8Match.replace(/['"]/g, '')
        }
    }

    return contentDisposition.match(/filename="?(?<name>[^";]+)"?/i)?.groups?.name ?? null
}

export const contractsApi = createApi({
    reducerPath: 'contractsApi',
    baseQuery: prepareBaseQuery({ path: 'contracts' }),
    endpoints: (builder) => ({
        downloadContract: builder.query({
            async queryFn({ contractId }, _queryApi, _extraOptions, fetchWithBQ) {
                await fetchWithBQ({
                    url: contractId,
                    method: 'get',
                    responseHandler: async (response) => {
                        const blob = await response.blob()
                        const contentDisposition = response.headers.get('content-disposition') || ''
                        const filename = resolveFilename(contentDisposition) || 'contrat.pdf'

                        const downloadUrl = window.URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = downloadUrl
                        link.download = filename
                        document.body.appendChild(link)
                        link.click()
                        link.remove()
                        window.URL.revokeObjectURL(downloadUrl)
                    },
                })
                return {
                    data: undefined,
                }
            },
        }),
        updateContract: builder.mutation({
            query: ({ userId, courseId, templateId, year }) => ({
                url: '',
                method: 'PUT',
                body: {
                    userId,
                    courseId,
                    templateId,
                    year,
                },
            }),
        }),
    }),
})

export const { useLazyDownloadContractQuery, useCreateContractMutation, useUpdateContractMutation } = contractsApi
