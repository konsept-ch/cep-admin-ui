import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import { rtkQueryErrorLogger } from './rtkQueryErrorLogger'
import { rootSaga } from './saga'
import { notificationsReducer } from './reducers/notifications'
import { agendaReducer } from './reducers/agenda'
import { inscriptionsReducer } from './reducers/inscriptions'
import { parametersReducer } from './reducers/parameters'
import { loadingReducer } from './reducers/loading'
import { templatesReducer } from './reducers/templates'
import { formateursReducer } from './reducers/formateurs'
import { usersApi } from './services/users'
import { organizationsApi } from './services/organizations'
import { coursesApi } from './services/courses'
import { sessionsApi } from './services/sessions'
import { invoicesApi } from './services/invoices'
import { manualInvoicesApi } from './services/manual-invoices'
import { inscriptionsApi } from './services/inscriptions'
import { attestationsApi } from './services/attestations'
import { contractTemplatesApi } from './services/contractTemplates'
import { eventsApi } from './services/events'

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
        [usersApi.reducerPath]: usersApi.reducer,
        [organizationsApi.reducerPath]: organizationsApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
        [sessionsApi.reducerPath]: sessionsApi.reducer,
        [invoicesApi.reducerPath]: invoicesApi.reducer,
        [manualInvoicesApi.reducerPath]: manualInvoicesApi.reducer,
        [inscriptionsApi.reducerPath]: inscriptionsApi.reducer,
        [attestationsApi.reducerPath]: attestationsApi.reducer,
        [contractTemplatesApi.reducerPath]: contractTemplatesApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            sagaMiddleware,
            usersApi.middleware,
            organizationsApi.middleware,
            coursesApi.middleware,
            sessionsApi.middleware,
            invoicesApi.middleware,
            manualInvoicesApi.middleware,
            inscriptionsApi.middleware,
            attestationsApi.middleware,
            contractTemplatesApi.middleware,
            eventsApi.middleware,
            rtkQueryErrorLogger,
        ]),
})

sagaMiddleware.run(rootSaga)

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
