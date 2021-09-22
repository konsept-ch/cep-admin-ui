import { GET_NOTIFICATIONS, SAVE_NOTIFICATION, SET_NOTIFICATION, ADD_NOTIFICATION } from '../constants/notifications'
import {
    getNotificationsAction,
    saveNotificationsAction,
    setNotificationsAction,
    addNotificationsAction,
} from './notifications'

describe('getNotificationsAction', () => {
    test('returns GET_NOTIFICATIONS with an empty payload', () => {
        expect(getNotificationsAction()).toEqual({
            type: GET_NOTIFICATIONS,
            payload: {},
        })
    })
})

describe('saveNotificationsAction', () => {
    test('returns SAVE_NOTIFICATION with its parameters in the payload', () => {
        const json = {}

        expect(saveNotificationsAction({ json: {} })).toEqual({
            type: SAVE_NOTIFICATION,
            payload: { json: {} },
        })
        expect(saveNotificationsAction({ json }).payload.json).toEqual(json)
    })
})

describe('setNotificationsAction', () => {
    test('returns SET_NOTIFICATION with its parameters in the payload', () => {
        const json = {}

        expect(setNotificationsAction({ json: {} })).toEqual({
            type: SET_NOTIFICATION,
            payload: { json: {} },
        })
        expect(setNotificationsAction({ json }).payload.json).toEqual(json)
    })
})

describe('addNotificationsAction', () => {
    test('returns ADD_NOTIFICATION with its parameters in the payload', () => {
        const json = {}

        expect(addNotificationsAction({ json: {} })).toEqual({
            type: ADD_NOTIFICATION,
            payload: { json: {} },
        })
        expect(addNotificationsAction({ json }).payload.json).toEqual(json)
    })
})
