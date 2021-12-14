import {
    FETCH_SESSIONS,
    SET_SESSIONS,
    UPDATE_SESSION,
    FETCH_SESSIONS_LESSONS,
    SET_SESSIONS_LESSONS,
} from '../constants/sessions'

export const fetchSessionsAction = () => ({
    type: FETCH_SESSIONS,
    payload: {},
})

export const fetchSessionsLessonsAction = () => ({
    type: FETCH_SESSIONS_LESSONS,
    payload: {},
})

export const updateSessionAction = ({
    sessionId,
    areInvitesSent,
    sessionName,
    startDate,
}: {
    sessionId: string
    areInvitesSent: string
    sessionName: string
    startDate: string
}) => ({
    type: UPDATE_SESSION,
    payload: { sessionId, areInvitesSent, sessionName, startDate },
})

export const setSessionsAction = ({ sessions }: { sessions: any }) => ({
    type: SET_SESSIONS,
    payload: { sessions },
})

export const setSessionsLessonsAction = ({ sessionsLessons }: { sessionsLessons: any }) => ({
    type: SET_SESSIONS_LESSONS,
    payload: { sessionsLessons },
})
