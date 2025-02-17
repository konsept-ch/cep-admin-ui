import { toast } from 'react-toastify'

import { MIDDLEWARE_URL } from '../constants/config'
import { cookies } from '../utils'

async function response2Json(response) {
    try {
        return await response.json()
    } catch (ex) {
        return { message: `${response.status} ${response.statusText}` }
    }
}

export const prepareBaseQuery =
    ({ path }) =>
    async (options) => {
        const { url, method, body } =
            typeof options === 'string' ? { url: options, method: 'GET', body: null } : options
        const isFormData = body instanceof FormData

        try {
            const response = await fetch(new URL(`${path}/${url}`, MIDDLEWARE_URL).href, {
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'x-login-email-address': cookies.get('email'),
                    'x-login-email-code': cookies.get('code'),
                    'x-login-token': cookies.get('token'),
                },
                mode: 'cors',
                redirect: 'error',
                method,
                body: body && !isFormData ? JSON.stringify(body) : body,
            })

            const json = await response2Json(response)

            if (!response.ok) throw json
            if (json.message) toast[json.severity || 'success'](json.message)

            //if (response.headers.has('metadata')) setStorage(JSON.parse(atob(response.headers.get('metadata'))))

            return { data: json }
        } catch (err) {
            if (err.message) toast.error(err.message, { autoClose: false })
            return {
                error: err,
            }
        }
    }
