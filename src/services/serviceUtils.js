import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import { MIDDLEWARE_URL } from '../constants/config'
import { cookies } from '../utils'

export const prepareBaseQuery = ({ servicePath }) => {
    try {
        return fetchBaseQuery({
            baseUrl: new URL(servicePath, MIDDLEWARE_URL).href,
            prepareHeaders: (headers) => {
                headers.set('Access-Control-Allow-Origin', '*')
                headers.set('x-login-email-address', cookies.get('email'))
                headers.set('x-login-email-code', cookies.get('code'))
                headers.set('x-login-token', cookies.get('token'))
                return headers
            },
        })
    } catch (error) {
        // Missing HTTPS? Redirect here or elsewhere?
        console.error(error)

        const RetryToast = () => (
            <div>
                Erreur de URL
                {window.location.protocol === 'http:' && (
                    <>
                        {' '}
                        - vous devez utiliser HTTPS
                        <Button
                            className="d-block mb-1"
                            variant="primary"
                            onClick={() => {
                                window.location.protocol = 'https:'
                            }}
                        >
                            <FontAwesomeIcon icon={faRotateRight} /> Utiliser HTTPS
                        </Button>
                    </>
                )}
            </div>
        )

        toast(<RetryToast />, { autoClose: false })
    }
}
