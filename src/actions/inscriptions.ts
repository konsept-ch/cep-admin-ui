import { FETCH_INSCRIPTIONS, SET_INSCRIPTIONS } from '../constants/inscriptions'

export const fetchInscriptionsAction = () => ({
    type: FETCH_INSCRIPTIONS,
    payload: {},
})

export const setInscriptionsAction = ({ inscriptions }: { inscriptions: any }) => ({
    type: SET_INSCRIPTIONS,
    payload: { inscriptions },
})
