import { SET_SESSIONS } from '../constants/sessions'

const initialState = {
    sessions: [],
}

export const sessionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSIONS:
            return {
                ...state,
                sessions: action.payload.sessions,
            }
        default:
            return state
    }
}

export const sessionsSelectors = {
    sessionsSelector: (state) => state.sessions,
}
