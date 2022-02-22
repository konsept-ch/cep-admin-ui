import { SET_LOGS } from '../constants/logs'

const initialState = {
    logs: [],
}

export const logsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGS:
            return {
                logs: action.payload.logs,
            }
        default:
            return state
    }
}

export const logsSelectors = {
    logsSelector: (state) => state.logs,
}
