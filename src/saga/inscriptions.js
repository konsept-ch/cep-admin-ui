import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_INSCRIPTIONS, UPDATE_INSCRIPTIONS } from '../constants/inscriptions'
import { setInscriptionsAction } from '../actions/inscriptions'
import { setLoadingAction, setGridLoadingAction } from '../actions/loading'
import { callService } from './sagaUtils'

function* fetchInscriptionsSaga() {
    yield put(setGridLoadingAction({ loading: true }))

    const inscriptions = yield call(callService, { endpoint: 'inscriptions' })

    yield put(setInscriptionsAction({ inscriptions }))

    yield put(setGridLoadingAction({ loading: false }))
}

function* updateInscriptionsSaga({ payload: { inscriptionId, newStatus, emailTemplateId, successCallback } }) {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `inscriptions/${inscriptionId}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus, emailTemplateId }),
        },
    })

    yield put(setLoadingAction({ loading: false }))

    successCallback()
}

export function* inscriptionsSaga() {
    yield takeEvery(FETCH_INSCRIPTIONS, fetchInscriptionsSaga)
    yield takeEvery(UPDATE_INSCRIPTIONS, updateInscriptionsSaga)
}
