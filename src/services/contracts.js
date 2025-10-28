import { createApi } from '@reduxjs/toolkit/query/react'

import { prepareBaseQuery } from './serviceUtils'

const MIME_EXTENSION_MAP = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.oasis.opendocument.text': 'odt',
}

const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1f]+/g

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

export const deriveExtension = (mimeType) => {
    if (!mimeType) return null

    const normalized = mimeType.toLowerCase()
    if (MIME_EXTENSION_MAP[normalized]) return MIME_EXTENSION_MAP[normalized]

    const subtype = normalized.split('/')[1]
    if (!subtype) return null

    const cleaned = subtype.split('+')[0]?.split(';')[0]
    return cleaned && cleaned !== 'octet-stream' ? cleaned : null
}

const sanitizeFilename = (filename, fallback) => {
    const trimmed = filename?.trim().replace(INVALID_FILENAME_CHARS, '_') ?? ''
    return trimmed.length > 0 ? trimmed : fallback
}

export const buildDownloadFilename = ({ contentDisposition, mimeType, fallbackBaseName = 'contrat' }) => {
    const extension = deriveExtension(mimeType)
    const resolved = resolveFilename(contentDisposition)
    const sanitized = sanitizeFilename(resolved, fallbackBaseName)

    if (!extension) return sanitized

    const hasExtension = /\.[A-Za-z0-9]{1,8}$/.test(sanitized)
    return hasExtension ? sanitized : `${sanitized}.${extension}`
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
                        const filename = buildDownloadFilename({
                            contentDisposition,
                            mimeType: blob.type,
                            fallbackBaseName: `contrat-${contractId}`,
                        })

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
