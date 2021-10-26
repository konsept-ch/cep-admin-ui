import { FETCH_ADMINS, SET_ADMINS } from '../constants/users'

export const fetchAdminsAction = () => ({
    type: FETCH_ADMINS,
    payload: {},
})
export const setAdminsAction = ({ admins }: { admins: any }) => ({
    type: SET_ADMINS,
    payload: { admins },
})
