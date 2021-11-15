import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchOrganizationsAction } from '../actions/organizations'
import { organizationsSelector } from '../reducers'
import { Grid } from '../components'

export function OrganizationsPage() {
    const dispatch = useDispatch()
    const organizations = useSelector(organizationsSelector)

    useEffect(() => {
        dispatch(fetchOrganizationsAction())
    }, [])

    const columnDefs = [
        {
            field: 'name',
            headerName: 'Titre de la organisation',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le nom de la organisation',
        },
        {
            field: 'code',
            headerName: 'Code',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le code de la organisation',
        },
    ]

    const rowData = organizations?.map(({ id, name, code }) => ({
        id,
        name,
        code,
    }))

    return <Grid name="Organisations" columnDefs={columnDefs} rowData={rowData} />
}
