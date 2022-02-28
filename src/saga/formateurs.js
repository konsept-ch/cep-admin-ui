import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_FORMATEURS } from '../constants/formateurs'
import { setFormateursAction } from '../actions/formateurs'
import { callService } from './sagaUtils'
import { setGridLoadingAction } from '../actions/loading'

function* fetchFormateursSaga(action) {
    yield put(setGridLoadingAction({ loading: true }))
    const formateurs = yield call(callService, { endpoint: 'formateurs', action })

    yield put(setFormateursAction({ formateurs }))
    yield put(setGridLoadingAction({ loading: false }))
}

export function* formateursSaga() {
    yield takeEvery(FETCH_FORMATEURS, fetchFormateursSaga)
}
