import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_ADMINS } from '../constants/users'
import { setAdminsAction } from '../actions/users'
import { callService } from './sagaUtils'

function* fetchUsersSaga() {
    const admins = yield call(callService, { endpoint: 'admins' })

    yield put(setAdminsAction({ admins }))
}

export function* usersSaga() {
    yield takeEvery(FETCH_ADMINS, fetchUsersSaga)
}
