import { FETCH_AGENDA, SET_AGENDA } from '../constants/agenda'

export const fetchAgendaAction = () => ({
    type: FETCH_AGENDA,
    payload: {},
})

export const setAgendaAction = ({ roomsAndEvents }: { roomsAndEvents: any }) => ({
    type: SET_AGENDA,
    payload: { roomsAndEvents },
})
