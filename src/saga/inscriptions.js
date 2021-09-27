import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_INSCRIPTIONS, UPDATE_INSCRIPTIONS } from '../constants/inscriptions'
import { setInscriptionsAction } from '../actions/inscriptions'
import { callService } from './sagaUtils'

function* fetchInscriptionsSaga() {
    const inscriptions = yield call(callService, { endpoint: 'inscriptions' })

    yield put(setInscriptionsAction({ inscriptions }))
}

function* updateInscriptionsSaga({ payload: { inscriptionId, newValue } }) {
    yield call(callService, {
        endpoint: `inscriptions/${inscriptionId}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newValue }),
        },
    })
}

export function* inscriptionsSaga() {
    yield takeEvery(FETCH_INSCRIPTIONS, fetchInscriptionsSaga)
    yield takeEvery(UPDATE_INSCRIPTIONS, updateInscriptionsSaga)
}
