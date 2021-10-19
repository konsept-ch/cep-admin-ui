import { SET_LOADING, SET_GRID_LOADING } from '../constants/loading'

export const setLoadingAction = ({ loading }: { loading: any }) => ({
    type: SET_LOADING,
    payload: { loading },
})

export const setGridLoadingAction = ({ loading }: { loading: any }) => ({
    type: SET_GRID_LOADING,
    payload: { loading },
})
