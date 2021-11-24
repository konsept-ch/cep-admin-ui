import { FETCH_INSCRIPTIONS, SET_INSCRIPTIONS, UPDATE_INSCRIPTIONS } from '../constants/inscriptions'

export const fetchInscriptionsAction = () => ({
    type: FETCH_INSCRIPTIONS,
    payload: {},
})

export const setInscriptionsAction = ({ inscriptions }: { inscriptions: any }) => ({
    type: SET_INSCRIPTIONS,
    payload: { inscriptions },
})

export const updateInscriptionStatusAction = ({
    inscriptionId,
    newStatus,
    emailTemplateId,
    successCallback,
}: {
    inscriptionId: any
    newStatus: any
    emailTemplateId: any
    successCallback: any
}) => ({
    type: UPDATE_INSCRIPTIONS,
    payload: { inscriptionId, newStatus, emailTemplateId, successCallback },
})
