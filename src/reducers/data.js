import { SAVE_DATA } from '../constants/actions'

const initialState = {
    data: [],
}

export const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_DATA:
            // eslint-disable-next-line no-console
            console.log(state)
            return {
                data: [...state.data, ...action.payload],
            }
        default:
            return state
    }
}

export const dataSelector = (state) => state.data
