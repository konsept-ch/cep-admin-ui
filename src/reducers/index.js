import { combineReducers } from 'redux'
import { notificationsReducer } from './notifications'
import { agendaReducer, agendaSelectors } from './agenda'

export const rootReducer = combineReducers({
    notifications: notificationsReducer,
    agenda: agendaReducer,
})

export const roomsAndEventsSelector = (state) => agendaSelectors.roomsAndEventsSelector(state.agenda)
