import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_ORGANIZATIONS } from '../constants/organizations'
import { setOrganizationsAction } from '../actions/organizations'
import { callService } from './sagaUtils'
import { setGridLoadingAction } from '../actions/loading'

function* fetchOrganizationsSaga(action) {
    yield put(setGridLoadingAction({ loading: true }))
    const organizations = yield call(callService, { endpoint: 'organizations', action })

    yield put(setOrganizationsAction({ organizations }))
    yield put(setGridLoadingAction({ loading: false }))
}

export function* organizationsSaga() {
    yield takeEvery(FETCH_ORGANIZATIONS, fetchOrganizationsSaga)
}
