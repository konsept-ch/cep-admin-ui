import { SET_PARAMETERS } from '../constants/parameters'

const initialState = {
    parameters: {},
}

export const parametersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PARAMETERS:
            return {
                parameters: action.payload.parameters,
            }
        default:
            return state
    }
}

export const parametersSelectors = {
    parametersSelector: (state) => state.parameters,
}
