import { isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { isDev } from './constants/config'

/**
 * Log an error and show a toast!
 */
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
        console.error('Fetch error')

        if (isDev) {
            console.error(JSON.stringify(action.error))
        }

        toast.error('Erreur du serveur', { autoClose: false })
    }

    return next(action)
}
