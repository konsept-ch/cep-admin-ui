import { FETCH_FORMATEURS, SET_FORMATEURS } from '../constants/formateurs'

export const fetchFormateursAction = () => ({
    type: FETCH_FORMATEURS,
    payload: {},
})

export const setFormateursAction = ({ formateurs }: { formateurs: any }) => ({
    type: SET_FORMATEURS,
    payload: { formateurs },
})
