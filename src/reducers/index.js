import { agendaSelectors } from './agenda'
import { inscriptionsSelectors } from './inscriptions'
import { sessionsSelectors } from './sessions'
import { parametersSelectors } from './parameters'
import { loadingSelectors } from './loading'
import { coursesSelectors } from './courses'
import { templatesSelectors } from './templates'
import { formateursSelectors } from './formateurs'

export const roomsAndEventsSelector = (state) => agendaSelectors.roomsAndEventsSelector(state.agenda)
export const inscriptionsSelector = (state) => inscriptionsSelectors.inscriptionsSelector(state.inscriptions)
export const sessionsSelector = (state) => sessionsSelectors.sessionsSelector(state.sessions)
export const parametersSelector = (state) => parametersSelectors.parametersSelector(state.parameters)
export const loadingSelector = (state) => loadingSelectors.loadingSelector(state.loading)
export const gridLoadingSelector = (state) => loadingSelectors.gridLoadingSelector(state.loading)
export const templatesLoadingSelector = (state) => loadingSelectors.templatesLoadingSelector(state.loading)
export const coursesSelector = (state) => coursesSelectors.coursesSelector(state.courses)
export const templatesSelector = (state) => templatesSelectors.templatesSelector(state.templates)
export const templateForInvitesSelector = (state) => templatesSelectors.templateForInvitesSelector(state.templates)
export const templatePreviewsSelector = (state) => templatesSelectors.templatePreviewsSelector(state.templates)
export const formateursSelector = (state) => formateursSelectors.formateursSelector(state.formateurs)
