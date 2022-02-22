import { FETCH_LOGS, SET_LOGS } from '../constants/logs'

export const fetchLogsAction = () => ({
    type: FETCH_LOGS,
    payload: {},
})

export const setLogsAction = ({ logs }: { logs: any }) => ({
    type: SET_LOGS,
    payload: { logs },
})
