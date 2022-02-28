import { SET_FORMATEURS } from '../constants/formateurs'

const initialState = {
    formateurs: [],
}

export const formateursReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_FORMATEURS:
            return {
                ...state,
                formateurs: payload.formateurs,
            }
        default:
            return state
    }
}

export const formateursSelectors = {
    formateursSelector: (state) => state.formateurs,
}
