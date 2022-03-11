import {
    FETCH_TEMPLATES,
    SET_TEMPLATES,
    UPDATE_TEMPLATE,
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
    FETCH_TEMPLATE_PREVIEWS,
    SET_TEMPLATE_PREVIEWS,
    SET_TEMPLATE_RAW_PREVIEW,
    FETCH_TEMPLATE_RAW_PREVIEW,
} from '../constants/templates'

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

export const fetchTemplatePreviewsAction = ({
    templateId,
    sessionId,
    inscriptionId,
}: {
    templateId: any
    sessionId: any
    inscriptionId: any
}) => ({
    type: FETCH_TEMPLATE_PREVIEWS,
    payload: { templateId, sessionId, inscriptionId },
})

export const setTemplatePreviewsAction = ({ previews }: { previews: any }) => ({
    type: SET_TEMPLATE_PREVIEWS,
    payload: { previews },
})

export const setTemplateRawPreviewAction = ({ templateRaw }: { templateRaw: any }) => ({
    type: SET_TEMPLATE_RAW_PREVIEW,
    payload: { templateRaw },
})

export const fetchTemplateRawPreviewAction = ({ templateId }: { templateId: any }) => ({
    type: FETCH_TEMPLATE_RAW_PREVIEW,
    payload: { templateId },
})
