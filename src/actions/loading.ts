import { SET_LOADING } from '../constants/loading'

export const setLoadingAction = ({ loading }: { loading: any }) => ({
    type: SET_LOADING,
    payload: { loading },
})
