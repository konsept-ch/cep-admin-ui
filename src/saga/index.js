import { all } from 'redux-saga/effects'
import { notificationsSaga } from './notifications'
import { agendaSaga } from './agenda'
import { inscriptionsSaga } from './inscriptions'
import { sessionsSaga } from './sessions'
import { parametersSaga } from './parameters'
import { templatesSaga } from './templates'
import { formateursSaga } from './formateurs'

export function* rootSaga() {
    yield all([
        notificationsSaga(),
        agendaSaga(),
        inscriptionsSaga(),
        sessionsSaga(),
        parametersSaga(),
        templatesSaga(),
        formateursSaga(),
    ])
}
