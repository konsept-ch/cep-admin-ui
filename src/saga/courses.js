import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_COURSES } from '../constants/courses'
import { setCoursesAction } from '../actions/courses'
import { callService } from './sagaUtils'

function* fetchCoursesSaga() {
    const courses = yield call(callService, { endpoint: 'courses' })

    yield put(setCoursesAction({ courses }))
}

// function* updateCoursesSaga({ payload: { inscriptionId, newStatus, emailTemplateName, successCallback } }) {
//     yield put(setLoadingAction({ loading: true }))

//     yield call(callService, {
//         endpoint: `courses/${inscriptionId}`,
//         options: {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ status: newStatus, emailTemplateName }),
//         },
//     })

//     yield put(setLoadingAction({ loading: false }))

//     successCallback()
// }

export function* coursesSaga() {
    yield takeEvery(FETCH_COURSES, fetchCoursesSaga)
    // yield takeEvery(UPDATE_COURSES, updateCoursesSaga)
}
