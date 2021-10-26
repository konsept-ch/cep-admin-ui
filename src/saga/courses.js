import { call, takeEvery, put } from 'redux-saga/effects'

import { FETCH_COURSES, UPDATE_COURSE } from '../constants/courses'
import { setCoursesAction } from '../actions/courses'
import { callService } from './sagaUtils'
import { setLoadingAction } from '../actions/loading'

function* fetchCoursesSaga() {
    const courses = yield call(callService, { endpoint: 'courses' })

    yield put(setCoursesAction({ courses }))
}

function* updateCourseSaga({ payload: { courseId, field, newValue } }) {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `course/${courseId}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ field, newValue }),
        },
    })

    yield put(setLoadingAction({ loading: false }))
}

export function* coursesSaga() {
    yield takeEvery(FETCH_COURSES, fetchCoursesSaga)
    yield takeEvery(UPDATE_COURSE, updateCourseSaga)
}
