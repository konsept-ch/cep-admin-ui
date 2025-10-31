import { toast } from 'react-toastify'

import { MIDDLEWARE_URL } from '../constants/config'
import { cookies } from '../utils'

const JSON_CONTENT_TYPE = 'application/json'

const hasJsonContentType = (response) => {
    const contentType = response.headers.get('content-type')
    return Boolean(contentType && contentType.includes('json'))
}

const parseJsonSafely = async (response) => {
    try {
        return await response.json()
    } catch (error) {
        return undefined
    }
}

const parseBody = async (response) => {
    if (hasJsonContentType(response)) {
        const json = await parseJsonSafely(response.clone())
        if (json !== undefined) return json
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.startsWith('text/')) return await response.text()

    return undefined
}

const showToastIfAny = (payload) => {
    if (!payload || typeof payload !== 'object') return

    const { message, severity } = payload
    if (message) toast[severity || 'success'](message)
}

const toErrorPayload = (response, data) => {
    if (data && typeof data === 'object') return data
    return { message: `${response.status} ${response.statusText}` }
}

const appendQueryParams = (url, params = {}) => {
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
            value.forEach((entry) => {
                if (entry === undefined || entry === null) return
                url.searchParams.append(key, `${entry}`)
            })
            return
        }

        url.searchParams.append(key, `${value}`)
    })
}

const shouldJsonStringify = (body, isFormData) => {
    if (body === null || body === undefined) return false
    if (isFormData) return false
    if (typeof body !== 'object') return false
    if (typeof Blob !== 'undefined' && body instanceof Blob) return false
    if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) return false
    if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) return false
    return true
}

export const prepareBaseQuery =
    ({ path }) =>
    async (options) => {
        const normalizedOptions = typeof options === 'string' ? { url: options } : options
        const {
            url,
            method = 'GET',
            body = null,
            params,
            responseHandler,
            headers: customHeaders = {},
            signal,
            ...fetchOverrides
        } = normalizedOptions

        const isFormData = body instanceof FormData
        const requestUrl = new URL(`${path}/${url}`, MIDDLEWARE_URL)
        appendQueryParams(requestUrl, params)

        const headers = {
            ...(isFormData ? {} : { 'Content-Type': JSON_CONTENT_TYPE }),
            'Access-Control-Allow-Origin': '*',
            'x-login-email-address': cookies.get('email'),
            'x-login-email-code': cookies.get('code'),
            'x-login-token': cookies.get('token'),
            ...customHeaders,
        }

        const hasCustomAccept = Object.keys(headers).some((key) => key.toLowerCase() === 'accept')
        if (!hasCustomAccept) {
            headers.Accept = responseHandler ? '*/*' : JSON_CONTENT_TYPE
        }

        const requestBody = shouldJsonStringify(body, isFormData) ? JSON.stringify(body) : body

        try {
            const response = await fetch(requestUrl.href, {
                mode: 'cors',
                redirect: 'error',
                method,
                headers,
                body: requestBody,
                signal,
                ...fetchOverrides,
            })

            const parsedBody = await parseBody(response.clone())

            if (!response.ok) {
                const errorData = parsedBody ?? (await parseBody(response))
                const errorPayload = toErrorPayload(response, errorData)
                showToastIfAny({ ...errorPayload, severity: 'error' })

                return {
                    error: errorPayload,
                }
            }

            if (responseHandler) {
                const handlerResult = await responseHandler(response)
                showToastIfAny(parsedBody)

                return { data: handlerResult }
            }

            const data = parsedBody ?? (await parseBody(response))
            const toastPayload =
                data && typeof data === 'object' && !Array.isArray(data)
                    ? data
                    : hasJsonContentType(response)
                    ? await parseJsonSafely(response)
                    : undefined
            showToastIfAny(toastPayload)

            return { data }
        } catch (error) {
            if (error?.message) toast.error(error.message, { autoClose: false })
            return {
                error,
            }
        }
    }
