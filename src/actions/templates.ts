import { FETCH_TEMPLATES, SET_TEMPLATES, UPDATE_TEMPLATE, ADD_TEMPLATE } from '../constants/templates'

export const fetchTemplatesAction = () => ({
    type: FETCH_TEMPLATES,
    payload: {},
})

export const updateTemplateAction = (templateData: any) => ({
    type: UPDATE_TEMPLATE,
    payload: templateData,
})

export const addTemplateAction = (templateData: any) => ({
    type: ADD_TEMPLATE,
    payload: templateData,
})

export const setTemplatesAction = ({ templates }: { templates: any }) => ({
    type: SET_TEMPLATES,
    payload: { templates },
})
