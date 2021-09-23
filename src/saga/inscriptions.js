import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_INSCRIPTIONS } from '../constants/inscriptions'
import { setInscriptionsAction } from '../actions/inscriptions'
import { callService } from './sagaUtils'

function* fetchInscriptionsSaga() {
    const inscriptions = yield call(callService, { endpoint: 'inscriptions' })

    yield put(setInscriptionsAction({ inscriptions }))
}

export function* inscriptionsSaga() {
    yield takeEvery(FETCH_INSCRIPTIONS, fetchInscriptionsSaga)
}
