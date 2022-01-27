import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Spinner } from 'react-bootstrap'

import { fetchOrganizationsAction } from '../actions/organizations'
import { addOrganisationsToCoursesAction, removeOrganisationsFromCoursesAction } from '../actions/courses'
import { organizationsSelector, loadingSelector } from '../reducers'
import { Grid, CommonModal } from '../components'
import { Helmet } from 'react-helmet-async'

export function OrganizationsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const dispatch = useDispatch()
    const organizations = useSelector(organizationsSelector)
    const isSagaLoading = useSelector(loadingSelector)

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
        ].filter(Boolean)

    const rowData = organizations.flatMap((organization) => flattenOrganizations(organization))

    return (
        <>
            <Helmet>
                <title>Organisations - Former22</title>
            </Helmet>
            <CommonModal
                title="Ajouter organisations"
                content={<p>Ajouter toutes les organisations (sauf NREF) dans chaque formation ?</p>}
                footer={
                    <Button
                        variant="success"
                        onClick={() => {
                            dispatch(addOrganisationsToCoursesAction())
                        }}
                    >
                        {isSagaLoading ? (
                            <>
                                <Spinner animation="grow" size="sm" /> Ajouter...
                            </>
                        ) : (
                            'Ajouter'
                        )}
                    </Button>
                }
                isVisible={isAddModalOpen}
                onHide={() => setIsAddModalOpen(false)}
            />
            <CommonModal
                title="Supprimer organisations"
                content={<p>Supprimer toutes les organisations (sauf celle par défaut) de chaque formation ?</p>}
                footer={
                    <Button
                        variant="danger"
                        onClick={() => {
                            dispatch(removeOrganisationsFromCoursesAction())
                        }}
                    >
                        {isSagaLoading ? (
                            <>
                                <Spinner animation="grow" size="sm" /> Supprimer...
                            </>
                        ) : (
                            'Supprimer'
                        )}
                    </Button>
                }
                isVisible={isRemoveModalOpen}
                onHide={() => setIsRemoveModalOpen(false)}
            />
            <Button variant="success" onClick={() => setIsAddModalOpen(true)}>
                Ajouter organisations
            </Button>
            <Button variant="danger" onClick={() => setIsRemoveModalOpen(true)}>
                Supprimer organisations
            </Button>
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
                groupDefaultExpanded={1}
                groupIncludeFooter={false}
            />
        </>
    )
}
