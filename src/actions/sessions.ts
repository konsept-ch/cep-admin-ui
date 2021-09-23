import { FETCH_SESSIONS, SET_SESSIONS } from '../constants/sessions'

export const fetchSessionsAction = () => ({
    type: FETCH_SESSIONS,
    payload: {},
})

export const setSessionsAction = ({ sessions }: { sessions: any }) => ({
    type: SET_SESSIONS,
    payload: { sessions },
})
