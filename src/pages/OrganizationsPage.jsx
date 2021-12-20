import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchOrganizationsAction } from '../actions/organizations'
import { organizationsSelector } from '../reducers'
import { Grid } from '../components'
import { Helmet } from 'react-helmet-async'

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
            hide: true,
        },
        {
            field: 'code',
            headerName: 'Code',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le code de la organisation',
        },
        {
            field: 'type',
            headerName: 'Type',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Le type de la organisation',
        },
    ]

    const flattenOrganizations = ({ id, name, code, type, children }, parentName) =>
        [
            {
                id,
                name,
                code,
                type,
                orgHierarchy: parentName ? [...parentName, name] : [name],
            },
            ...(children?.length > 0
                ? children.flatMap((childOrg) =>
                      flattenOrganizations(childOrg, parentName ? [...parentName, name] : [name])
                  )
                : [false]),
            ,
        ].filter(Boolean)

    const rowData = organizations.flatMap((organization) => flattenOrganizations(organization))

    return (
        <>
            <Helmet>
                <title>Organisations - Former22</title>
            </Helmet>
            <Grid
                name="Organisations"
                columnDefs={columnDefs}
                rowData={rowData}
                treeData
                getDataPath={({ orgHierarchy }) => orgHierarchy}
                groupSelectsChildren={false} // groupSelectsChildren does not work with tree data
                groupDisplayType="singleColumn" //you cannot mix groupMultiAutoColumn with treeData, only one column can be used to display groups when doing tree data
                defaultColDef={{
                    enableValue: true,
                    enablePivot: true,
                    enableRowGroup: true,
                    resizable: true,
                    sortable: true,
                    filter: true,
                    aggFunc: false,
                }}
                autoGroupColumnDef={{
                    headerName: 'Hiérarchie des organisations',
                    minWidth: 650,
                    cellRendererParams: {
                        suppressCount: true,
                    },
                }}
                groupDefaultExpanded={0}
                groupIncludeFooter={false}
            />
        </>
    )
}
