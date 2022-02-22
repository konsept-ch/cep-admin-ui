import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_LOGS } from '../constants/logs'
import { setLogsAction } from '../actions/logs'
import { setGridLoadingAction } from '../actions/loading'
import { callService } from './sagaUtils'

function* fetchLogsSaga(action) {
    yield put(setGridLoadingAction({ loading: true }))

    const logs = yield call(callService, { endpoint: 'logs', action })

    yield put(setLogsAction({ logs }))

    yield put(setGridLoadingAction({ loading: false }))
}

export function* logsSaga() {
    yield takeEvery(FETCH_LOGS, fetchLogsSaga)
}
