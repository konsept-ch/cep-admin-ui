import { SET_TEMPLATES } from '../constants/templates'

const initialState = {
    templates: [],
}

export const templatesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TEMPLATES:
            return {
                templates: action.payload.templates,
            }
        default:
            return state
    }
}

export const templatesSelectors = {
    templatesSelector: (state) => state.templates,
}
