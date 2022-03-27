// import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevToolsLogOnlyInProduction } from '@redux-devtools/extension'
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'

import { notificationsReducer } from './reducers/notifications'
import { agendaReducer } from './reducers/agenda'
import { inscriptionsReducer } from './reducers/inscriptions'
import { sessionsReducer } from './reducers/sessions'
import { parametersReducer } from './reducers/parameters'
import { loadingReducer } from './reducers/loading'
import { coursesReducer } from './reducers/courses'
import { usersReducer } from './reducers/users'
import { templatesReducer } from './reducers/templates'
import { organizationsReducer } from './reducers/organizations'
import { formateursReducer } from './reducers/formateurs'
import { rootSaga } from './saga'

const sagaMiddleware = createSagaMiddleware()

// export const store = createStore(rootReducer, composeWithDevToolsLogOnlyInProduction(applyMiddleware(sagaMiddleware)))
export const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
        agenda: agendaReducer,
        inscriptions: inscriptionsReducer,
        sessions: sessionsReducer,
        parameters: parametersReducer,
        loading: loadingReducer,
        courses: coursesReducer,
        users: usersReducer,
        templates: templatesReducer,
        organizations: organizationsReducer,
        formateurs: formateursReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
