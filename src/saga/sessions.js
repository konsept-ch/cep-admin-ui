import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_SESSIONS } from '../constants/sessions'
import { setSessionsAction } from '../actions/sessions.ts'
import { callService } from './sagaUtils'
import { setGridLoadingAction } from '../actions/loading'

function* fetchSessionsSaga() {
    yield put(setGridLoadingAction({ loading: true }))
    const sessions = yield call(callService, { endpoint: 'sessions' })

    yield put(setSessionsAction({ sessions }))
    yield put(setGridLoadingAction({ loading: false }))
}

export function* sessionsSaga() {
    yield takeEvery(FETCH_SESSIONS, fetchSessionsSaga)
}
