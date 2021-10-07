import { all } from 'redux-saga/effects'
import { notificationsSaga } from './notifications'
import { agendaSaga } from './agenda'
import { inscriptionsSaga } from './inscriptions'
import { sessionsSaga } from './sessions'
import { parametersSaga } from './parameters'

export function* rootSaga() {
    yield all([notificationsSaga(), agendaSaga(), inscriptionsSaga(), sessionsSaga(), parametersSaga()])
}