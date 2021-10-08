import { SET_COURSES } from '../constants/courses'

const initialState = {
    courses: [],
}

export const coursesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COURSES:
            return {
                courses: action.payload.courses,
            }
        default:
            return state
    }
}

export const coursesSelectors = {
    coursesSelector: (state) => state.courses,
}
