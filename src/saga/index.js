import { all } from 'redux-saga/effects'
import { notificationsSaga } from './notifications'
import { agendaSaga } from './agenda'
import { inscriptionsSaga } from './inscriptions'
import { sessionsSaga } from './sessions'
import { parametersSaga } from './parameters'
import { coursesSaga } from './courses'
// import { usersSaga } from './users'
import { templatesSaga } from './templates'
import { organizationsSaga } from './organizations'
import { formateursSaga } from './formateurs'

export function* rootSaga() {
    yield all([
        notificationsSaga(),
        agendaSaga(),
        inscriptionsSaga(),
        sessionsSaga(),
        parametersSaga(),
        coursesSaga(),
        // usersSaga(),
        templatesSaga(),
        organizationsSaga(),
        formateursSaga(),
    ])
}
