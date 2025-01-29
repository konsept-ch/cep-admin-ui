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
import { authApi } from './services/auth'
import { usersApi } from './services/users'
import { organizationsApi } from './services/organizations'
import { coursesApi } from './services/courses'
import { sessionsApi } from './services/sessions'
import { invoicesApi } from './services/invoices'
import { manualInvoicesApi } from './services/manual-invoices'
import { inscriptionsApi } from './services/inscriptions'
import { attestationsApi } from './services/attestations'
import { contractTemplatesApi } from './services/contractTemplates'
import { contractsApi } from './services/contracts'
import { evaluationTemplatesApi } from './services/evaluationTemplates'
import { eventsApi } from './services/events'
import { evaluationsApi } from './services/evaluations'
import { formateursApi } from './services/formateurs'
import { templatesApi } from './services/templates'
import { tutorsApi } from './services/tutors'
import { agendaApi } from './services/agenda'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
        agenda: agendaReducer,
        inscriptions: inscriptionsReducer,
        parameters: parametersReducer,
        loading: loadingReducer,
        templates: templatesReducer,
        // Add the generated reducer as a specific top-level slice
        [agendaApi.reducerPath]: agendaApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [organizationsApi.reducerPath]: organizationsApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
        [sessionsApi.reducerPath]: sessionsApi.reducer,
        [invoicesApi.reducerPath]: invoicesApi.reducer,
        [manualInvoicesApi.reducerPath]: manualInvoicesApi.reducer,
        [inscriptionsApi.reducerPath]: inscriptionsApi.reducer,
        [attestationsApi.reducerPath]: attestationsApi.reducer,
        [contractTemplatesApi.reducerPath]: contractTemplatesApi.reducer,
        [contractsApi.reducerPath]: contractsApi.reducer,
        [evaluationTemplatesApi.reducerPath]: evaluationTemplatesApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        [formateursApi.reducerPath]: formateursApi.reducer,
        [evaluationsApi.reducerPath]: evaluationsApi.reducer,
        [templatesApi.reducerPath]: templatesApi.reducer,
        [tutorsApi.reducerPath]: tutorsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            sagaMiddleware,
            agendaApi.middleware,
            authApi.middleware,
            usersApi.middleware,
            organizationsApi.middleware,
            coursesApi.middleware,
            sessionsApi.middleware,
            invoicesApi.middleware,
            manualInvoicesApi.middleware,
            inscriptionsApi.middleware,
            attestationsApi.middleware,
            contractTemplatesApi.middleware,
            contractsApi.middleware,
            evaluationTemplatesApi.middleware,
            eventsApi.middleware,
            evaluationsApi.middleware,
            formateursApi.middleware,
            templatesApi.middleware,
            tutorsApi.middleware,
            rtkQueryErrorLogger,
        ]),
})

sagaMiddleware.run(rootSaga)

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
