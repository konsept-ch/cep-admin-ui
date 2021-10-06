import { SET_LOADING } from '../constants/loading'

const initialState = {
    loading: false,
}

export const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                loading: action.payload.loading,
            }
        default:
            return state
    }
}

export const loadingSelectors = {
    loadingSelector: (state) => state.loading,
}
