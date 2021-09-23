import { combineReducers } from 'redux'
import { notificationsReducer } from './notifications'
import { agendaReducer, agendaSelectors } from './agenda'
import { inscriptionsReducer, inscriptionsSelectors } from './inscriptions'
import { sessionsReducer, sessionsSelectors } from './sessions'

export const rootReducer = combineReducers({
    notifications: notificationsReducer,
    agenda: agendaReducer,
    inscriptions: inscriptionsReducer,
    sessions: sessionsReducer,
})

export const roomsAndEventsSelector = (state) => agendaSelectors.roomsAndEventsSelector(state.agenda)
export const inscriptionsSelector = (state) => inscriptionsSelectors.inscriptionsSelector(state.inscriptions)
export const sessionsSelector = (state) => sessionsSelectors.sessionsSelector(state.sessions)
