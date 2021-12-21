import { call, takeEvery, put } from 'redux-saga/effects'

import {
    FETCH_COURSES,
    UPDATE_COURSE,
    ADD_ORGANISATIONS_TO_COURSES,
    REMOVE_ORGANISATIONS_FROM_COURSES,
} from '../constants/courses'
import { setCoursesAction } from '../actions/courses'
import { callService } from './sagaUtils'
import { setLoadingAction, setGridLoadingAction } from '../actions/loading'

function* fetchCoursesSaga() {
    yield put(setGridLoadingAction({ loading: true }))
    const courses = yield call(callService, { endpoint: 'courses' })

    yield put(setCoursesAction({ courses }))
    yield put(setGridLoadingAction({ loading: false }))
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

function* addOrganisationsToCoursesSaga() {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'courses/addOrganisations',
        options: { method: 'PUT' },
    })

    yield put(setLoadingAction({ loading: false }))
}

function* removeOrganisationsFromCoursesSaga() {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'courses/removeOrganisations',
        options: { method: 'PUT' },
    })

    yield put(setLoadingAction({ loading: false }))
}

export function* coursesSaga() {
    yield takeEvery(FETCH_COURSES, fetchCoursesSaga)
    yield takeEvery(UPDATE_COURSE, updateCourseSaga)
    yield takeEvery(ADD_ORGANISATIONS_TO_COURSES, addOrganisationsToCoursesSaga)
    yield takeEvery(REMOVE_ORGANISATIONS_FROM_COURSES, removeOrganisationsFromCoursesSaga)
}
