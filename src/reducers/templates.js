import { SET_TEMPLATES, SET_TEMPLATE_PREVIEWS } from '../constants/templates'

const initialState = {
    templates: [],
    templatePreviews: {},
}

export const templatesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TEMPLATES:
            return {
                ...state,
                templates: action.payload.templates,
            }
        case SET_TEMPLATE_PREVIEWS:
            return {
                ...state,
                templatePreviews: action.payload.previews,
            }
        default:
            return state
    }
}

export const templatesSelectors = {
    templatesSelector: (state) => state.templates,
    templateForInvitesSelector: (state) => state.templates.find((template) => template.isUsedForSessionInvites),
    templatePreviewsSelector: (state) => state.templatePreviews,
}
