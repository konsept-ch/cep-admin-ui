import { GET_DATA, SAVE_DATA } from '../constants/actions'
import { getDataAction, saveDataAction } from './data'

describe('getDataAction', () => {
    test('returns GET_DATA with an empty payload', () => {
        expect(getDataAction()).toEqual({
            type: GET_DATA,
            payload: {},
        })
    })
})

describe('saveDataAction', () => {
    test('returns SAVE_DATA with its parameters in the payload', () => {
        const json = {}

        expect(saveDataAction({ json: {} })).toEqual({
            type: SAVE_DATA,
            payload: { json: {} },
        })
        expect(saveDataAction({ json }).payload.json).toEqual(json)
    })
})
