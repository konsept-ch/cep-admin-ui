import { FETCH_INSCRIPTIONS, SET_INSCRIPTIONS, UPDATE_INSCRIPTIONS } from '../constants/inscriptions'

export const fetchInscriptionsAction = () => ({
    type: FETCH_INSCRIPTIONS,
    payload: {},
})

export const setInscriptionsAction = ({ inscriptions }: { inscriptions: any }) => ({
    type: SET_INSCRIPTIONS,
    payload: { inscriptions },
})

export const updateInscriptionStatusAction = ({ inscriptionId, newValue }: { inscriptionId: any; newValue: any }) => ({
    type: UPDATE_INSCRIPTIONS,
    payload: { inscriptionId, newValue },
})
