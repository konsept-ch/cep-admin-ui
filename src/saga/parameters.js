import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_PARAMETERS } from '../constants/parameters'
import { setParametersAction } from '../actions/parameters'
import { callService } from './sagaUtils'

function* fetchParametersSaga(action) {
    const templates = yield call(callService, { endpoint: 'templates', action })

    yield put(setParametersAction({ parameters: { emailTemplates: templates } }))
}

export function* parametersSaga() {
    yield takeEvery(FETCH_PARAMETERS, fetchParametersSaga)
}
