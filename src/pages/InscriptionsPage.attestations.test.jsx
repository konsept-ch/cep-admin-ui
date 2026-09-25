/**
 * Tests de non-regression : l'ecran doit dire a l'operateur si une generation
 * d'attestation a echoue.
 *
 * Avant le 25.09.2026, `useGenerateAttestationMutation` etait appele sans lire son
 * resultat et aucun toast ne concernait l'attestation : un 500 du middleware ne produisait
 * strictement aucun retour a l'ecran. Le declencheur RTK Query **resout** avec { error }
 * au lieu de rejeter, donc un simple `.then()` ne suffit pas.
 *
 * docs/90-incidents/investigation_attestations_che_plantes_2026-09.md
 */
import { act, render } from '@testing-library/react'

import { InscriptionsPage } from './InscriptionsPage'

const mockGenerateAttestation = jest.fn()
const mockToastError = jest.fn()
const mockToastSuccess = jest.fn()

let capturedAttestationModalProps = null

jest.mock('react-helmet-async', () => ({
    Helmet: ({ children }) => <>{children}</>,
}))

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '/inscriptions' }),
}))

jest.mock('react-toastify', () => ({
    toast: {
        error: (...args) => mockToastError(...args),
        success: (...args) => mockToastSuccess(...args),
    },
}))

jest.mock('../components', () => ({
    Grid: () => null,
    StatusUpdateModal: () => null,
    MassStatusUpdateModal: () => null,
}))

jest.mock('../components/ChangeOrganizationModal', () => ({
    ChangeOrganizationModal: () => null,
}))

jest.mock('../components/GenerateAttestationModal', () => ({
    GenerateAttestationModal: (props) => {
        capturedAttestationModalProps = props

        return null
    },
}))

jest.mock('../services/inscriptions', () => ({
    useGetInscriptionsQuery: () => ({
        data: [],
        isFetching: false,
        refetch: jest.fn(),
    }),
    useUpdateInscriptionStatusMutation: () => [jest.fn(), { isLoading: false }],
}))

jest.mock('../services/attestations', () => ({
    useGenerateAttestationMutation: () => [mockGenerateAttestation, { isLoading: false }],
}))

const declencherGeneration = async () => {
    await act(async () => {
        await capturedAttestationModalProps.generateAttestation({
            selectedAttestationTemplateUuid: 'un-modele',
        })
    })
}

describe("retour d'erreur sur la generation d'attestation", () => {
    beforeEach(() => {
        sessionStorage.clear()
        capturedAttestationModalProps = null
        mockGenerateAttestation.mockReset()
        mockToastError.mockReset()
        mockToastSuccess.mockReset()

        render(<InscriptionsPage />)
    })

    test('un echec du middleware produit un toast d erreur, jamais un succes', async () => {
        mockGenerateAttestation.mockResolvedValue({ error: { status: 500, data: 'Erreur' } })

        await declencherGeneration()

        expect(mockToastError).toHaveBeenCalledTimes(1)
        expect(mockToastSuccess).not.toHaveBeenCalled()
    })

    test('un lot partiellement en echec nomme les participants concernes', async () => {
        mockGenerateAttestation.mockResolvedValue({
            data: {
                generated: 2,
                failures: [
                    { participant: 'Serge Pidoux', reason: 'Espace personnel incomplet.' },
                    { participant: 'Florence Vez', reason: 'Espace personnel incomplet.' },
                ],
            },
        })

        await declencherGeneration()

        expect(mockToastSuccess).not.toHaveBeenCalled()
        expect(mockToastError).toHaveBeenCalledTimes(1)

        const message = mockToastError.mock.calls[0][0]
        expect(message).toContain('Serge Pidoux')
        expect(message).toContain('Florence Vez')
        expect(message).toContain('2')
    })

    test('un lot entierement reussi produit un toast de succes', async () => {
        mockGenerateAttestation.mockResolvedValue({ data: { generated: 3, failures: [] } })

        await declencherGeneration()

        expect(mockToastError).not.toHaveBeenCalled()
        expect(mockToastSuccess).toHaveBeenCalledTimes(1)
        expect(mockToastSuccess.mock.calls[0][0]).toContain('3')
    })

    test('le resultat de la mutation est bien lu, pas ignore', async () => {
        mockGenerateAttestation.mockResolvedValue({ data: { generated: 1, failures: [] } })

        await declencherGeneration()

        // si l'appel n'etait pas attendu, aucun toast n'aurait ete emis
        expect(mockGenerateAttestation).toHaveBeenCalledTimes(1)
        expect(mockToastSuccess.mock.calls.length + mockToastError.mock.calls.length).toBe(1)
    })
})
