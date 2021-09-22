import { call, takeEvery } from 'redux-saga/effects'

import { GET_NOTIFICATIONS } from '../constants/notifications'
// import { setNotificationsAction } from '../actions/notifications'
// import { usersDataUrl, loadFromClaroline, otherParams } from '../server'
import { callService } from './sagaUtils'

function* getNotificationsSaga() {
    const serviceResult = yield call(callService)

    console.log(serviceResult)
}

export function* inscriptionsSaga() {
    yield takeEvery(GET_NOTIFICATIONS, getNotificationsSaga)
}
