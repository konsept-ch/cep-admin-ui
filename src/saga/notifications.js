import { takeEvery } from 'redux-saga/effects'

import { GET_NOTIFICATIONS } from '../constants/notifications'
// import { setNotificationsAction } from '../actions/notifications'
// import { callService } from './sagaUtils'

function* getNotificationsSaga() {
    // const serviceResult = yield call(callService)
    // console.log(serviceResult)
}

export function* notificationsSaga() {
    yield takeEvery(GET_NOTIFICATIONS, getNotificationsSaga)
}
