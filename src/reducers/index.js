import { agendaSelectors } from './agenda'
import { inscriptionsSelectors } from './inscriptions'
import { parametersSelectors } from './parameters'
import { loadingSelectors } from './loading'
import { templatesSelectors } from './templates'

export const roomsAndEventsSelector = (state) => agendaSelectors.roomsAndEventsSelector(state.agenda)
export const inscriptionsSelector = (state) => inscriptionsSelectors.inscriptionsSelector(state.inscriptions)
export const parametersSelector = (state) => parametersSelectors.parametersSelector(state.parameters)
export const loadingSelector = (state) => loadingSelectors.loadingSelector(state.loading)
export const gridLoadingSelector = (state) => loadingSelectors.gridLoadingSelector(state.loading)
export const templatesLoadingSelector = (state) => loadingSelectors.templatesLoadingSelector(state.loading)
export const templatesSelector = (state) => templatesSelectors.templatesSelector(state.templates)
export const templateForInvitesSelector = (state) => templatesSelectors.templateForInvitesSelector(state.templates)
export const templatePreviewsSelector = (state) => templatesSelectors.templatePreviewsSelector(state.templates)
