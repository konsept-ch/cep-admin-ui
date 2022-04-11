import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'

import { rootSaga } from './saga'
import { notificationsReducer } from './reducers/notifications'
import { agendaReducer } from './reducers/agenda'
import { inscriptionsReducer } from './reducers/inscriptions'
import { sessionsReducer } from './reducers/sessions'
import { parametersReducer } from './reducers/parameters'
import { loadingReducer } from './reducers/loading'
import { coursesReducer } from './reducers/courses'
import { usersReducer } from './reducers/users'
import { templatesReducer } from './reducers/templates'
import { formateursReducer } from './reducers/formateurs'
import { adminsApi } from './services/admins'
import { usersApi } from './services/users'
import { organizationsApi } from './services/organizations'

const sagaMiddleware = createSagaMiddleware()

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
        formateurs: formateursReducer,
        // Add the generated reducer as a specific top-level slice
        [adminsApi.reducerPath]: adminsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [organizationsApi.reducerPath]: organizationsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(sagaMiddleware)
            .concat(adminsApi.middleware)
            .concat(usersApi.middleware)
            .concat(organizationsApi.middleware),
})

sagaMiddleware.run(rootSaga)

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
