import {
    FETCH_COURSES,
    SET_COURSES,
    UPDATE_COURSE,
    ADD_ORGANISATIONS_TO_COURSES,
    REMOVE_ORGANISATIONS_FROM_COURSES,
} from '../constants/courses'

export const fetchCoursesAction = () => ({
    type: FETCH_COURSES,
    payload: {},
})

export const setCoursesAction = ({ courses }: { courses: any }) => ({
    type: SET_COURSES,
    payload: { courses },
})

export const updateCourseAction = ({ courseId, field, newValue }: { courseId: any; field: any; newValue: any }) => ({
    type: UPDATE_COURSE,
    payload: { courseId, field, newValue },
})

export const addOrganisationsToCoursesAction = () => ({
    type: ADD_ORGANISATIONS_TO_COURSES,
    payload: {},
})

export const removeOrganisationsFromCoursesAction = () => ({
    type: REMOVE_ORGANISATIONS_FROM_COURSES,
    payload: {},
})
