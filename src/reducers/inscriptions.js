import { SET_INSCRIPTIONS } from '../constants/inscriptions'

const initialState = {
    inscriptions: [],
}

export const inscriptionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_INSCRIPTIONS:
            return {
                inscriptions: action.payload.inscriptions,
            }
        default:
            return state
    }
}

export const inscriptionsSelectors = {
    inscriptionsSelector: (state) => state.inscriptions,
}
