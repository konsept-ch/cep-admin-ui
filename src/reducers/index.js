import { combineReducers } from 'redux'
import { notificationsReducer } from './notifications'
import { agendaReducer, agendaSelectors } from './agenda'
import { inscriptionsReducer, inscriptionsSelectors } from './inscriptions'

export const rootReducer = combineReducers({
    notifications: notificationsReducer,
    agenda: agendaReducer,
    inscriptions: inscriptionsReducer,
})

export const roomsAndEventsSelector = (state) => agendaSelectors.roomsAndEventsSelector(state.agenda)
export const inscriptionsSelector = (state) => inscriptionsSelectors.inscriptionsSelector(state.inscriptions)
