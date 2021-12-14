import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_SESSIONS, UPDATE_SESSION, FETCH_SESSIONS_LESSONS } from '../constants/sessions'
import { setSessionsAction, setSessionsLessonsAction } from '../actions/sessions.ts'
import { callService } from './sagaUtils'
import { setGridLoadingAction } from '../actions/loading'

function* fetchSessionsSaga() {
    yield put(setGridLoadingAction({ loading: true }))
    const sessions = yield call(callService, { endpoint: 'sessions' })

    yield put(setSessionsAction({ sessions }))
    yield put(setGridLoadingAction({ loading: false }))
}

function* fetchSessionsLessonsSaga() {
    const sessionsLessons = yield call(callService, { endpoint: 'sessions/lessons' })

    yield put(setSessionsLessonsAction({ sessionsLessons }))
}

function* updateSessionSaga({ payload: { sessionId, areInvitesSent, sessionName, startDate } }) {
    yield put(setGridLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `sessions/${sessionId}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ areInvitesSent, sessionName, startDate }),
        },
    })

    yield put(setGridLoadingAction({ loading: false }))
}

export function* sessionsSaga() {
    yield takeEvery(FETCH_SESSIONS, fetchSessionsSaga)
    yield takeEvery(FETCH_SESSIONS_LESSONS, fetchSessionsLessonsSaga)
    yield takeEvery(UPDATE_SESSION, updateSessionSaga)
}
