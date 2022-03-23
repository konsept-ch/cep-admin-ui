import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_INSCRIPTIONS, UPDATE_INSCRIPTIONS, MASS_UPDATE_INSCRIPTIONS } from '../constants/inscriptions'
import { setInscriptionsAction } from '../actions/inscriptions'
import { setLoadingAction, setGridLoadingAction } from '../actions/loading'
import { callService } from './sagaUtils'

function* fetchInscriptionsSaga(action) {
    yield put(setGridLoadingAction({ loading: true }))

    const inscriptions = yield call(callService, { endpoint: 'inscriptions', action })

    yield put(setInscriptionsAction({ inscriptions }))

    yield put(setGridLoadingAction({ loading: false }))
}

function* updateInscriptionsSaga(action) {
    const {
        payload: { inscriptionId, newStatus, emailTemplateId, shouldSendSms, successCallback },
    } = action

    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `inscriptions/${inscriptionId}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus, emailTemplateId, shouldSendSms }),
        },
        action,
        successCallback,
    })

    yield put(setLoadingAction({ loading: false }))
}

function* massUpdateInscriptionsSaga(action) {
    const {
        payload: { inscriptionsIds, newStatus, emailTemplateId, successCallback },
    } = action

    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'inscriptions/mass/update',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus, emailTemplateId, inscriptionsIds }),
        },
        action,
        successCallback,
    })

    yield put(setLoadingAction({ loading: false }))
}

export function* inscriptionsSaga() {
    yield takeEvery(FETCH_INSCRIPTIONS, fetchInscriptionsSaga)
    yield takeEvery(UPDATE_INSCRIPTIONS, updateInscriptionsSaga)
    yield takeEvery(MASS_UPDATE_INSCRIPTIONS, massUpdateInscriptionsSaga)
}
