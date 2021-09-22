import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_AGENDA } from '../constants/agenda'
import { setAgendaAction } from '../actions/agenda'
import { callService } from './sagaUtils'

function* fetchAgendaSaga() {
    const roomsAndEvents = yield call(callService, { endpoint: 'roomsAndEvents' })

    yield put(setAgendaAction({ roomsAndEvents }))
}

export function* agendaSaga() {
    yield takeEvery(FETCH_AGENDA, fetchAgendaSaga)
}
