import { SET_ADMINS } from '../constants/users'

const initialState = {
    admins: [],
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADMINS:
            return {
                admins: action.payload.admins,
            }
        default:
            return state
    }
}

export const usersSelectors = {
    adminsSelector: (state) => state.admins,
}
