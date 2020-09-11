import { SAVE_DATA, GET_DATA } from '../constants/actions'

export const saveDataAction = (payload) => ({
    type: SAVE_DATA,
    payload,
})

export const getDataAction = () => ({
    type: GET_DATA,
    payload: {},
})
