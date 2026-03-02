import { render } from '@testing-library/react'

import { FormateursPage } from './FormateursPage'

const mockGrid = jest.fn(() => null)

jest.mock('react-helmet-async', () => ({
    Helmet: ({ children }) => <>{children}</>,
}))

jest.mock('../components', () => ({
    Grid: (props) => mockGrid(props),
}))

jest.mock('../services/formateurs', () => ({
    useGetFormateursQuery: () => ({
        data: [],
        isFetching: false,
    }),
}))

describe('FormateursPage columns', () => {
    test('keeps export-relevant columns available in definitions', () => {
        render(<FormateursPage />)

        const props = mockGrid.mock.calls[0][0]
        const fields = props.columnDefs.map(({ field }) => field).filter(Boolean)

        expect(fields).toContain('profession')
        expect(fields).toContain('organizationCode')
        expect(fields).toContain('hierarchy')
        expect(fields).toContain('email')
        expect(fields).toContain('contract')
    })
})
