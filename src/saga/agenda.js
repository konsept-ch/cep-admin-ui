import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_AGENDA } from '../constants/agenda'
import { setAgendaAction } from '../actions/agenda'
import { callService } from './sagaUtils'
import { setLoadingAction } from '../actions/loading'

function* fetchAgendaSaga() {
    yield put(setLoadingAction({ loading: true }))

    const roomsAndEvents = yield call(callService, { endpoint: 'roomsAndEvents' })

    yield put(setAgendaAction({ roomsAndEvents }))

    yield put(setLoadingAction({ loading: false }))
}

export function* agendaSaga() {
    yield takeEvery(FETCH_AGENDA, fetchAgendaSaga)
}
