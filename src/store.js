import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import { rootSaga } from './saga'
import { notificationsReducer } from './reducers/notifications'
import { agendaReducer } from './reducers/agenda'
import { inscriptionsReducer } from './reducers/inscriptions'
import { parametersReducer } from './reducers/parameters'
import { loadingReducer } from './reducers/loading'
import { templatesReducer } from './reducers/templates'
import { formateursReducer } from './reducers/formateurs'
import { adminsApi } from './services/admins'
import { usersApi } from './services/users'
import { organizationsApi } from './services/organizations'
import { coursesApi } from './services/courses'
import { sessionsApi } from './services/sessions'
import { invoicesApi } from './services/invoices'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
        agenda: agendaReducer,
        inscriptions: inscriptionsReducer,
        parameters: parametersReducer,
        loading: loadingReducer,
        templates: templatesReducer,
        formateurs: formateursReducer,
        // Add the generated reducer as a specific top-level slice
        [adminsApi.reducerPath]: adminsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [organizationsApi.reducerPath]: organizationsApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
        [sessionsApi.reducerPath]: sessionsApi.reducer,
        [invoicesApi.reducerPath]: invoicesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            sagaMiddleware,
            usersApi.middleware,
            adminsApi.middleware,
            organizationsApi.middleware,
            coursesApi.middleware,
            sessionsApi.middleware,
            invoicesApi.middleware,
        ]),
})

sagaMiddleware.run(rootSaga)

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
