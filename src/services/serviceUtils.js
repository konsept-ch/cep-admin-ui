import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { MIDDLEWARE_URL } from '../constants/config'
import { cookies } from '../utils'

export const prepareBaseQuery = ({ servicePath }) =>
    fetchBaseQuery({
        baseUrl: new URL(servicePath, MIDDLEWARE_URL).href,
        prepareHeaders: (headers) => {
            headers.set('Access-Control-Allow-Origin', '*')
            headers.set('x-login-email-address', cookies.get('email'))
            headers.set('x-login-email-code', cookies.get('code'))
            headers.set('x-login-token', cookies.get('token'))
            return headers
        },
    })
