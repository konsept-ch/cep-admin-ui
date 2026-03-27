import { render } from '@testing-library/react'

import { InscriptionsPage } from './InscriptionsPage'

const mockGrid = jest.fn(() => null)

jest.mock('react-helmet-async', () => ({
    Helmet: ({ children }) => <>{children}</>,
}))

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '/inscriptions' }),
}))

jest.mock('../components', () => ({
    Grid: (props) => mockGrid(props),
    StatusUpdateModal: () => null,
    MassStatusUpdateModal: () => null,
}))

jest.mock('../components/ChangeOrganizationModal', () => ({
    ChangeOrganizationModal: () => null,
}))

jest.mock('../components/GenerateAttestationModal', () => ({
    GenerateAttestationModal: () => null,
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
    useGenerateAttestationMutation: () => [jest.fn()],
}))

describe('InscriptionsPage grouping defaults', () => {
    test('sets expected default row groups for participants grid', () => {
        sessionStorage.clear()
        mockGrid.mockClear()

        render(<InscriptionsPage />)

        const props = mockGrid.mock.calls[0][0]
        expect(props.groupModel).toEqual([
            { colId: 'coordinator', rowGroup: true, rowGroupIndex: 0 },
            { colId: 'startYear', rowGroup: true, rowGroupIndex: 1 },
            { colId: 'courseName', rowGroup: true, rowGroupIndex: 2 },
            { colId: 'sessionName', rowGroup: true, rowGroupIndex: 3 },
        ])
    })
})
