import { SET_ORGANIZATIONS } from '../constants/organizations'

const initialState = {
    organizations: [],
}

export const organizationsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_ORGANIZATIONS:
            return {
                ...state,
                organizations: payload.organizations,
            }
        default:
            return state
    }
}

export const organizationsSelectors = {
    organizationsSelector: (state) => state.organizations,
}
