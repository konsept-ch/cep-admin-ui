import { GET_NOTIFICATIONS, ADD_NOTIFICATION, SAVE_NOTIFICATION, SET_NOTIFICATION } from '../constants/notifications'

export const getNotificationsAction = () => ({
    type: GET_NOTIFICATIONS,
    payload: {},
})

export const addNotificationsAction = ({ json }: { json: any }) => ({
    type: ADD_NOTIFICATION,
    payload: { json },
})

export const saveNotificationsAction = ({ json }: { json: any }) => ({
    type: SAVE_NOTIFICATION,
    payload: { json },
})

export const setNotificationsAction = ({ json }: { json: any }) => ({
    type: SET_NOTIFICATION,
    payload: { json },
})
