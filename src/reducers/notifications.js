import { ADD_NOTIFICATION } from '../constants/notifications'

const initialState = {
    notifications: [],
}

export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return {
                notifications: [...state.notifications, ...action.payload],
            }
        default:
            return state
    }
}

export const notificationsSelector = (state) => state.notifications
