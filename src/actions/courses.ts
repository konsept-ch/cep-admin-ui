import { FETCH_COURSES, SET_COURSES, UPDATE_COURSE } from '../constants/courses'

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
