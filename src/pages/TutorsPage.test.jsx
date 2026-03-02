import { render } from '@testing-library/react'

import { TutorsPage } from './TutorsPage'

const mockGrid = jest.fn(() => null)

jest.mock('react-helmet-async', () => ({
    Helmet: ({ children }) => <>{children}</>,
}))

jest.mock('../components', () => ({
    Grid: (props) => mockGrid(props),
}))

jest.mock('../services/tutors', () => ({
    useGetTutorsQuery: () => ({
        data: [],
        refetch: jest.fn(),
        isFetching: false,
    }),
    useUpdateTutorMutation: () => [jest.fn(), { isLoading: false }],
}))

describe('TutorsPage columns', () => {
    test('includes recently added editable fields in grid columns', () => {
        render(<TutorsPage />)

        const props = mockGrid.mock.calls[0][0]
        const fields = props.columnDefs.map(({ field }) => field).filter(Boolean)

        expect(fields).toContain('phoneNumber')
        expect(fields).toContain('rfResponsible')
        expect(fields).toContain('givenTitles')
    })
})
