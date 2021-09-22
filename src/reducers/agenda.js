import { SET_AGENDA } from '../constants/agenda'

const initialState = {
    roomsAndEvents: { rooms: [], events: [] },
}

export const agendaReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AGENDA:
            return {
                roomsAndEvents: action.payload.roomsAndEvents,
            }
        default:
            return state
    }
}

export const agendaSelectors = {
    roomsAndEventsSelector: (state) => state.roomsAndEvents,
}
