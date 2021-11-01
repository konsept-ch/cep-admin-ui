import { FETCH_SESSIONS, SET_SESSIONS, UPDATE_SESSION } from '../constants/sessions'

export const fetchSessionsAction = () => ({
    type: FETCH_SESSIONS,
    payload: {},
})

export const updateSessionAction = ({ sessionId, areInvitesSent }: { sessionId: string; areInvitesSent: string }) => ({
    type: UPDATE_SESSION,
    payload: { sessionId, areInvitesSent },
})

export const setSessionsAction = ({ sessions }: { sessions: any }) => ({
    type: SET_SESSIONS,
    payload: { sessions },
})
