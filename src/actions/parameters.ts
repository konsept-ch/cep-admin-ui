import { FETCH_PARAMETERS, SET_PARAMETERS } from '../constants/parameters'

export const fetchParametersAction = () => ({
    type: FETCH_PARAMETERS,
    payload: {},
})

export const setParametersAction = ({ parameters }: { parameters: any }) => ({
    type: SET_PARAMETERS,
    payload: { parameters },
})
