/**
 * Tests de non-regression : un changement de statut ne part qu'une fois.
 *
 * Le 10.09.2026, deux clics a 4 s d'intervalle sur "Confirmer" ont envoye deux
 * "Invitee -> Annulee facturable" pour la meme inscription. Le middleware a facture deux
 * fois l'annulation, sous le meme numero (26381040). Le bouton n'etait desactive que
 * pendant le chargement des modeles d'e-mail, pas pendant la requete.
 *
 * docs/90-incidents/2026-11-12-doublon-facture-26381040.md
 */
import { act, fireEvent, render, screen } from '@testing-library/react'

import { StatusUpdateModal } from './StatusUpdateModal'

jest.mock('../services/attestations', () => ({
    useGetMinimumAttestationsQuery: () => ({ data: [], isLoading: false, isError: false }),
}))

jest.mock('../services/templates', () => ({
    useGetMinimumTemplatesQuery: () => ({ data: [], isLoading: false, isError: false }),
    useLazyGetTemplatePreviewQuery: () => [jest.fn(), { data: {}, isFetching: false }],
}))

jest.mock('./EmailTemplateBodyInput', () => ({ EmailTemplateBodyInput: () => null }))

// L'index des composants tire FullCalendar, que Jest ne sait pas lire : on n'en garde que
// le vrai bouton de confirmation, celui qui est teste.
jest.mock('.', () => ({
    ConfirmInscriptionChangeButton: jest.requireActual('./ConfirmInscriptionChangeButton')
        .ConfirmInscriptionChangeButton,
}))

const statusUpdateData = {
    id: 'inscription-test',
    status: 'Invitée',
    newStatus: 'Annulée facturable',
    remark: '',
    inscriptionDate: '2026-09-01T08:00:00.000Z',
    user: { firstName: 'Test', lastName: 'Test', email: 'test@example.test', shouldReceiveSms: false },
    session: { id: 'session-test', name: 'Session test', startDate: '2026-10-01T08:00:00.000Z' },
}

/** Une requete que le test termine quand il le decide. */
const pendingRequest = () => {
    let finish
    const updateStatus = jest.fn(
        () =>
            new Promise((resolve) => {
                finish = resolve
            })
    )

    return { updateStatus, finish: () => finish() }
}

const renderModal = (updateStatus) =>
    render(<StatusUpdateModal closeModal={jest.fn()} updateStatus={updateStatus} statusUpdateData={statusUpdateData} />)

const confirmButton = () => screen.getByRole('button', { name: /^Confirmer(\.\.\.)?$/ })
const confirmWithSmsButton = () => screen.getByRole('button', { name: /^Confirmer avec SMS/ })

describe('StatusUpdateModal', () => {
    it("n'envoie qu'un changement de statut sur un double clic", () => {
        const { updateStatus } = pendingRequest()
        renderModal(updateStatus)

        fireEvent.click(confirmButton())
        fireEvent.click(confirmButton())

        expect(updateStatus).toHaveBeenCalledTimes(1)
    })

    it("bloque aussi l'autre bouton de confirmation pendant la requete", () => {
        const { updateStatus } = pendingRequest()
        renderModal(updateStatus)

        fireEvent.click(confirmButton())
        fireEvent.click(confirmWithSmsButton())

        expect(updateStatus).toHaveBeenCalledTimes(1)
        expect(confirmButton().disabled).toBe(true)
        expect(confirmWithSmsButton().disabled).toBe(true)
    })

    it('rend la main une fois la requete terminee', async () => {
        const { updateStatus, finish } = pendingRequest()
        renderModal(updateStatus)

        fireEvent.click(confirmButton())
        await act(async () => finish())

        expect(confirmButton().disabled).toBe(false)
        fireEvent.click(confirmButton())
        expect(updateStatus).toHaveBeenCalledTimes(2)
    })
})
