import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

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

export const store = configureStore({
    reducer: {
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
        ]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
