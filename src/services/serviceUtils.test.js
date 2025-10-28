import { prepareBaseQuery } from './serviceUtils'
import { toast } from 'react-toastify'
import { cookies } from '../utils'

jest.mock('../constants/config', () => ({
    MIDDLEWARE_URL: 'https://middleware.test/',
}))

jest.mock('../utils', () => ({
    cookies: {
        get: jest.fn(),
    },
}))

jest.mock('react-toastify', () => {
    const toastMock = jest.fn()
    toastMock.success = jest.fn()
    toastMock.error = jest.fn()
    toastMock.info = jest.fn()
    toastMock.warn = jest.fn()
    return { toast: toastMock }
})

const createMockResponse = ({ ok = true, status = 200, statusText = 'OK', headers = {}, jsonData, textData } = {}) => {
    const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
        acc[key.toLowerCase()] = headers[key]
        return acc
    }, {})

    const buildJsonResult = () => {
        if (typeof jsonData === 'function') return jsonData()
        if (jsonData === undefined) return undefined
        return jsonData
    }

    const buildTextResult = () => {
        if (typeof textData === 'function') return textData()
        if (textData === undefined) return undefined
        return textData
    }

    const response = {
        ok,
        status,
        statusText,
        headers: {
            get: jest.fn((name) => normalizedHeaders[name.toLowerCase()] ?? null),
        },
        json: jest.fn(() => Promise.resolve(buildJsonResult())),
        text: jest.fn(() => Promise.resolve(buildTextResult())),
    }

    response.clone = jest.fn(() =>
        createMockResponse({
            ok,
            status,
            statusText,
            headers: normalizedHeaders,
            jsonData: buildJsonResult,
            textData: buildTextResult,
        })
    )

    return response
}

describe('prepareBaseQuery', () => {
    beforeEach(() => {
        cookies.get.mockImplementation((key) => `cookie-${key}`)
        global.fetch = jest.fn()
        jest.clearAllMocks()
    })

    it('returns responseHandler data for binary responses and keeps toast silent', async () => {
        const responseHandler = jest.fn().mockResolvedValue('blob-url')
        const response = createMockResponse({
            headers: { 'content-type': 'application/pdf' },
        })

        global.fetch.mockResolvedValue(response)

        const baseQuery = prepareBaseQuery({ path: 'contracts' })
        const result = await baseQuery({ url: '123', responseHandler })

        expect(result).toEqual({ data: 'blob-url' })
        expect(responseHandler).toHaveBeenCalledTimes(1)
        expect(toast.success).not.toHaveBeenCalled()
        expect(toast.error).not.toHaveBeenCalled()
        expect(global.fetch).toHaveBeenCalledWith(
            'https://middleware.test/contracts/123',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                    'x-login-email-address': 'cookie-email',
                    'x-login-email-code': 'cookie-code',
                    'x-login-token': 'cookie-token',
                }),
            })
        )
    })

    it('parses JSON success responses and shows the appropriate toast', async () => {
        const response = createMockResponse({
            headers: { 'content-type': 'application/json' },
            jsonData: { message: 'Contract created', severity: 'info' },
        })

        global.fetch.mockResolvedValue(response)

        const baseQuery = prepareBaseQuery({ path: 'contracts' })
        const result = await baseQuery({ url: 'create', method: 'POST', body: { id: 1 } })

        expect(result).toEqual({ data: { message: 'Contract created', severity: 'info' } })
        expect(toast.info).toHaveBeenCalledWith('Contract created')
        expect(global.fetch).toHaveBeenCalledWith(
            'https://middleware.test/contracts/create',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({ id: 1 }),
            })
        )
    })

    it('propagates API errors and surfaces error toasts', async () => {
        const response = createMockResponse({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            headers: { 'content-type': 'application/json' },
            jsonData: { message: 'Missing contract' },
        })

        global.fetch.mockResolvedValue(response)

        const baseQuery = prepareBaseQuery({ path: 'contracts' })
        const result = await baseQuery({
            url: 'missing',
            method: 'PUT',
            params: { foo: 'bar', multi: ['one', 'two'], skip: null },
            body: { active: true },
        })

        expect(global.fetch).toHaveBeenCalledWith(
            'https://middleware.test/contracts/missing?foo=bar&multi=one&multi=two',
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify({ active: true }),
            })
        )
        expect(result).toEqual({ error: { message: 'Missing contract' } })
        expect(toast.error).toHaveBeenCalledWith('Missing contract')
    })
})
