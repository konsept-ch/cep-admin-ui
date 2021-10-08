import { FETCH_COURSES, SET_COURSES } from '../constants/courses'

export const fetchCoursesAction = () => ({
    type: FETCH_COURSES,
    payload: {},
})

export const setCoursesAction = ({ courses }: { courses: any }) => ({
    type: SET_COURSES,
    payload: { courses },
})

// export const updateCourseStatusAction = ({
//     inscriptionId,
//     newStatus,
//     emailTemplateName,
//     successCallback,
// }: {
//     inscriptionId: any
//     newStatus: any
//     emailTemplateName: any
//     successCallback: any
// }) => ({
//     type: UPDATE_COURSES,
//     payload: { inscriptionId, newStatus, emailTemplateName, successCallback },
// })
