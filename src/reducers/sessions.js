import { SET_SESSIONS, SET_SESSIONS_LESSONS } from '../constants/sessions'

const initialState = {
    sessions: [],
    sessionsLessons: [],
}

export const sessionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSIONS:
            return {
                ...state,
                sessions: action.payload.sessions,
            }
        case SET_SESSIONS_LESSONS:
            return {
                ...state,
                sessionsLessons: action.payload.sessionsLessons,
            }
        default:
            return state
    }
}

export const sessionsSelectors = {
    sessionsSelector: (state) => state.sessions,
    sessionsLessonsSelector: (state) => state.sessionsLessons,
    sessionLessonsSelector:
        (state) =>
        ({ sessionId }) =>
            state.sessionsLessons.find((lessonsBySession) => Object.keys(lessonsBySession)[0] === sessionId)[sessionId],
}
