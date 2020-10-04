import { GET_DATA, SAVE_DATA } from '../constants/actions'

export const getDataAction = () => ({
    type: GET_DATA,
    payload: {},
})

export const saveDataAction = ({ json }: { json: any }) => ({
    type: SAVE_DATA,
    payload: { json },
})
