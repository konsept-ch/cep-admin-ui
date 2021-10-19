import { SET_LOADING, SET_GRID_LOADING } from '../constants/loading'

const initialState = {
    loading: false,
    gridLoading: false,
}

export const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload.loading,
            }
        case SET_GRID_LOADING:
            return {
                ...state,
                gridLoading: action.payload.loading,
            }
        default:
            return state
    }
}

export const loadingSelectors = {
    loadingSelector: (state) => state.loading,
    gridLoadingSelector: (state) => state.gridLoading,
}
