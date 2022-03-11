import { call, takeEvery, put } from 'redux-saga/effects'

import {
    FETCH_TEMPLATES,
    UPDATE_TEMPLATE,
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
    FETCH_TEMPLATE_PREVIEWS,
    FETCH_TEMPLATE_RAW_PREVIEW,
} from '../constants/templates'
import {
    setTemplatesAction,
    fetchTemplatesAction,
    setTemplatePreviewsAction,
    setTemplateRawPreviewAction,
} from '../actions/templates.ts'
import { setTemplatesLoadingAction } from '../actions/loading.ts'
import { callService } from './sagaUtils'
import { setLoadingAction } from '../actions/loading'

function* fetchTemplatesSaga(action) {
    yield put(setLoadingAction({ loading: true }))
    const templates = yield call(callService, { endpoint: 'templates', action })

    yield put(setTemplatesAction({ templates }))
    yield put(setLoadingAction({ loading: false }))
}

function* fetchTemplatePreviewsSaga(action) {
    const {
        payload: { templateId, sessionId, inscriptionId },
    } = action

    yield put(setTemplatesLoadingAction({ loading: true }))
    const previews = yield call(callService, {
        endpoint: `template/previews?templateId=${templateId}&sessionId=${sessionId}&inscriptionId=${inscriptionId}`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        action,
    })

    yield put(setTemplatePreviewsAction({ previews }))
    yield put(setTemplatesLoadingAction({ loading: false }))
}

function* fetchTemplateRawPreviewSaga(action) {
    const {
        payload: { templateId },
    } = action

    yield put(setTemplatesLoadingAction({ loading: true }))
    const templateRaw = yield call(callService, {
        endpoint: `template/previews/massUpdate?templateId=${templateId}`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        action,
    })

    yield put(setTemplateRawPreviewAction({ templateRaw }))
    yield put(setTemplatesLoadingAction({ loading: false }))
}

function* updateTemplateSaga(action) {
    const {
        payload: {
            templateData: { templateId, ...rest },
        },
    } = action

    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `templates/${templateId}`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rest),
        },
        action,
    })

    yield put(fetchTemplatesAction())

    yield put(setLoadingAction({ loading: false }))
}

function* addTemplateSaga(action) {
    const {
        payload: { templateData },
    } = action

    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'templates',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(templateData),
        },
        action,
    })

    yield put(fetchTemplatesAction())

    yield put(setLoadingAction({ loading: false }))
}

function* deleteTemplateSaga(action) {
    const {
        payload: { templateId },
    } = action

    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `templates/${templateId}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        action,
    })

    yield put(fetchTemplatesAction())

    yield put(setLoadingAction({ loading: false }))
}

export function* templatesSaga() {
    yield takeEvery(FETCH_TEMPLATES, fetchTemplatesSaga)
    yield takeEvery(FETCH_TEMPLATE_PREVIEWS, fetchTemplatePreviewsSaga)
    yield takeEvery(FETCH_TEMPLATE_RAW_PREVIEW, fetchTemplateRawPreviewSaga)
    yield takeEvery(UPDATE_TEMPLATE, updateTemplateSaga)
    yield takeEvery(ADD_TEMPLATE, addTemplateSaga)
    yield takeEvery(DELETE_TEMPLATE, deleteTemplateSaga)
}
