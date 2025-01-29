import { useState } from 'react'
import { toast } from 'react-toastify'
import { cookies } from '../utils'
import { MIDDLEWARE_URL } from '../constants/config'

async function response2Json(response) {
    try {
        return await response.json()
    } catch (ex) {
        return { message: `${response.status} ${response.statusText}` }
    }
}

export function useApi(url, method, immediate = false) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(immediate)

    return {
        data,
        loading,
        async send(path = '', data = null, formEncoding = false) {
            setLoading(true)
            try {
                const response = await fetch(MIDDLEWARE_URL + url + path, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'x-login-email-address': cookies.get('email'),
                        'x-login-email-code': cookies.get('code'),
                        'x-login-token': cookies.get('token'),
                    },
                    mode: 'cors',
                    redirect: 'error',
                    method,
                    body: data
                        ? formEncoding
                            ? Object.entries(data).reduce((form, [key, value]) => {
                                  form.append(key, value)
                                  return form
                              }, new FormData())
                            : JSON.stringify(data)
                        : null,
                })

                const json = await response2Json(response)

                if (!response.ok) throw json
                if (json.message) toast[json.severity || 'success'](json.message)

                if (response.headers.has('metadata')) setStorage(JSON.parse(atob(response.headers.get('metadata'))))

                setData(json)
            } catch (err) {
                if (err.message) toast.error(err.message)
                else throw err
            } finally {
                setLoading(false)
            }
        },
    }
}
