import { all } from 'redux-saga/effects'
import { inscriptionsSaga } from './notifications'
import { agendaSaga } from './agenda'

export function* rootSaga() {
    yield all([inscriptionsSaga(), agendaSaga()])
}
