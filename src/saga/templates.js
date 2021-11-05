import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_TEMPLATES, UPDATE_TEMPLATE, ADD_TEMPLATE, DELETE_TEMPLATE } from '../constants/templates'
import { setTemplatesAction, fetchTemplatesAction } from '../actions/templates.ts'
import { callService } from './sagaUtils'
import { setLoadingAction } from '../actions/loading'

function* fetchTemplatesSaga() {
    yield put(setLoadingAction({ loading: true }))
    const templates = yield call(callService, { endpoint: 'templates' })

    yield put(setTemplatesAction({ templates }))
    yield put(setLoadingAction({ loading: false }))
}

function* updateTemplateSaga({
    payload: {
        templateData: { templateId, ...rest },
    },
}) {
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
    })

    yield put(fetchTemplatesAction())

    yield put(setLoadingAction({ loading: false }))
}

function* addTemplateSaga({ payload: { templateData } }) {
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
    })

    yield put(fetchTemplatesAction())

    yield put(setLoadingAction({ loading: false }))
}

function* deleteTemplateSaga({ payload: { templateId } }) {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `templates/${templateId}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    })

    yield put(fetchTemplatesAction())

    yield put(setLoadingAction({ loading: false }))
}

export function* templatesSaga() {
    yield takeEvery(FETCH_TEMPLATES, fetchTemplatesSaga)
    yield takeEvery(UPDATE_TEMPLATE, updateTemplateSaga)
    yield takeEvery(ADD_TEMPLATE, addTemplateSaga)
    yield takeEvery(DELETE_TEMPLATE, deleteTemplateSaga)
}
