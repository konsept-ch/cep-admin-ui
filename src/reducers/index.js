import { combineReducers } from 'redux'
import { notificationsReducer } from './notifications'
import { agendaReducer, agendaSelectors } from './agenda'
import { inscriptionsReducer, inscriptionsSelectors } from './inscriptions'
import { sessionsReducer, sessionsSelectors } from './sessions'
import { parametersReducer, parametersSelectors } from './parameters'
import { loadingReducer, loadingSelectors } from './loading'

export const rootReducer = combineReducers({
    notifications: notificationsReducer,
    agenda: agendaReducer,
    inscriptions: inscriptionsReducer,
    sessions: sessionsReducer,
    parameters: parametersReducer,
    loading: loadingReducer,
})

export const roomsAndEventsSelector = (state) => agendaSelectors.roomsAndEventsSelector(state.agenda)
export const inscriptionsSelector = (state) => inscriptionsSelectors.inscriptionsSelector(state.inscriptions)
export const sessionsSelector = (state) => sessionsSelectors.sessionsSelector(state.sessions)
export const parametersSelector = (state) => parametersSelectors.parametersSelector(state.parameters)
export const loadingSelector = (state) => loadingSelectors.loadingSelector(state.loading)