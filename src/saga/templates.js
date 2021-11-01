import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_TEMPLATES, UPDATE_TEMPLATE, ADD_TEMPLATE } from '../constants/templates'
import { setTemplatesAction } from '../actions/templates.ts'
import { callService } from './sagaUtils'
import { setLoadingAction } from '../actions/loading'

function* fetchTemplatesSaga() {
    yield put(setLoadingAction({ loading: true }))
    const templates = yield call(callService, { endpoint: 'templates' })

    yield put(setTemplatesAction({ templates }))
    yield put(setLoadingAction({ loading: false }))
}

function* updateTemplateSaga({ payload: { templateId, ...rest } }) {
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

    yield put(setLoadingAction({ loading: false }))
}

function* addTemplateSaga({ payload }) {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'templates',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        },
    })

    yield put(setLoadingAction({ loading: false }))
}

export function* templatesSaga() {
    yield takeEvery(FETCH_TEMPLATES, fetchTemplatesSaga)
    yield takeEvery(UPDATE_TEMPLATE, updateTemplateSaga)
    yield takeEvery(ADD_TEMPLATE, addTemplateSaga)
}
