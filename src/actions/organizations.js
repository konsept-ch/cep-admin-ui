import { FETCH_ORGANIZATIONS, SET_ORGANIZATIONS } from '../constants/organizations'

export const fetchOrganizationsAction = () => ({
    type: FETCH_ORGANIZATIONS,
    payload: {},
})

export const setOrganizationsAction = ({ organizations }) => ({
    type: SET_ORGANIZATIONS,
    payload: { organizations },
})
