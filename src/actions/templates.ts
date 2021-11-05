import { FETCH_TEMPLATES, SET_TEMPLATES, UPDATE_TEMPLATE, ADD_TEMPLATE, DELETE_TEMPLATE } from '../constants/templates'

export const fetchTemplatesAction = () => ({
    type: FETCH_TEMPLATES,
    payload: {},
})

export const updateTemplateAction = ({ templateData }: { templateData: any }) => ({
    type: UPDATE_TEMPLATE,
    payload: { templateData },
})

export const addTemplateAction = ({ templateData }: { templateData: any }) => ({
    type: ADD_TEMPLATE,
    payload: { templateData },
})

export const setTemplatesAction = ({ templates }: { templates: any }) => ({
    type: SET_TEMPLATES,
    payload: { templates },
})

export const deleteTemplateAction = ({ templateId }: { templateId: any }) => ({
    type: DELETE_TEMPLATE,
    payload: { templateId },
})
