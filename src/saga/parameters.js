import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_PARAMETERS } from '../constants/parameters'
import { setParametersAction } from '../actions/parameters'
import { callService } from './sagaUtils'

function* fetchParametersSaga() {
    const parameters = yield call(callService, { endpoint: 'parameters' })

    yield put(setParametersAction({ parameters }))
}

export function* parametersSaga() {
    yield takeEvery(FETCH_PARAMETERS, fetchParametersSaga)
}
