import { call, takeEvery, put } from 'redux-saga/effects'

import {
    FETCH_COURSES,
    UPDATE_COURSE,
    ADD_ORGANIZATIONS_TO_COURSES,
    REMOVE_ORGANIZATIONS_FROM_COURSES,
} from '../constants/courses'
import { setCoursesAction } from '../actions/courses'
import { callService } from './sagaUtils'
import { setLoadingAction, setGridLoadingAction } from '../actions/loading'

function* fetchCoursesSaga(action) {
    yield put(setGridLoadingAction({ loading: true }))
    const courses = yield call(callService, { endpoint: 'courses', action })

    yield put(setCoursesAction({ courses }))
    yield put(setGridLoadingAction({ loading: false }))
}

function* updateCourseSaga(action) {
    const {
        payload: { courseId, field, newValue, header },
    } = action

    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: `course/${courseId}`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ field, newValue, header }),
        },
        action,
    })

    yield put(setLoadingAction({ loading: false }))
}

function* addOrganizationsToCoursesSaga(action) {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'courses/addOrganizations',
        options: { method: 'PUT' },
        action,
    })

    yield put(setLoadingAction({ loading: false }))
}

function* removeOrganizationsFromCoursesSaga(action) {
    yield put(setLoadingAction({ loading: true }))

    yield call(callService, {
        endpoint: 'courses/removeOrganizations',
        options: { method: 'PUT' },
        action,
    })

    yield put(setLoadingAction({ loading: false }))
}

export function* coursesSaga() {
    yield takeEvery(FETCH_COURSES, fetchCoursesSaga)
    yield takeEvery(UPDATE_COURSE, updateCourseSaga)
    yield takeEvery(ADD_ORGANIZATIONS_TO_COURSES, addOrganizationsToCoursesSaga)
    yield takeEvery(REMOVE_ORGANIZATIONS_FROM_COURSES, removeOrganizationsFromCoursesSaga)
}
