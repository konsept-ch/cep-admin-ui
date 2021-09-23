import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_SESSIONS } from '../constants/sessions'
import { setSessionsAction } from '../actions/sessions.ts'
import { callService } from './sagaUtils'

function* fetchSessionsSaga() {
    const sessions = yield call(callService, { endpoint: 'sessions' })

    yield put(setSessionsAction({ sessions }))
}

export function* sessionsSaga() {
    yield takeEvery(FETCH_SESSIONS, fetchSessionsSaga)
}
