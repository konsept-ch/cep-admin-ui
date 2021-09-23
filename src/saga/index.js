import { all } from 'redux-saga/effects'
import { notificationsSaga } from './notifications'
import { agendaSaga } from './agenda'
import { inscriptionsSaga } from './inscriptions'

export function* rootSaga() {
    yield all([notificationsSaga(), agendaSaga(), inscriptionsSaga()])
}
