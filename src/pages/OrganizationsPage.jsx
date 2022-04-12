import { useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import { Grid, CommonModal } from '../components'
import {
    useGetOrganizationsQuery,
    useAddOrganizationsMutation,
    useRemoveOrganizationsMutation,
} from '../services/organizations'

export function OrganizationsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

    const { data: organizations } = useGetOrganizationsQuery(null, { refetchOnMountOrArgChange: true })
    const [addOrganizations, { isLoading: isAddingOrganizations }] = useAddOrganizationsMutation()
    const [removeOrganizations, { isLoading: isRemovingOrganizations }] = useRemoveOrganizationsMutation()

    const columnDefs = [
        {
            field: 'name',
            headerName: "Titre de l'organisation",
            filter: 'agTextColumnFilter',
            headerTooltip: "Le nom de l'organisation",
            hide: true,
        },
        {
            field: 'code',
            headerName: 'Code',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le code de l'organisation",
        },
        {
            field: 'email',
            headerName: 'E-mail',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'e-mail de l'organisation",
        },
        {
            field: 'type',
            headerName: 'Type',
            filter: 'agSetColumnFilter',
            headerTooltip: "Le type de l'organisation",
            hide: true,
        },
    ]

    const flattenOrganizations = ({ id, name, code, type, children, email }, parentName) =>
        [
            {
                id,
                name,
                code,
                email,
                type,
                orgHierarchy: parentName ? [...parentName, name] : [name],
            },
            ...(children?.length > 0
                ? children.flatMap((childOrg) =>
                      flattenOrganizations(childOrg, parentName ? [...parentName, name] : [name])
                  )
                : [false]),
        ].filter(Boolean)

    const rowData = organizations?.flatMap((organization) => flattenOrganizations(organization))

    return (
        <>
            <Helmet>
                <title>Organisations - Former22</title>
            </Helmet>
            <CommonModal
                title="Ajouter organisations"
                content={<p>Ajouter toutes les organisations dans chaque formation ?</p>}
                footer={
                    <Button
                        variant="success"
                        onClick={async () => {
                            const { error } = await addOrganizations()

                            if (typeof error === 'undefined') {
                                toast.success('Organisations ajoutées', { autoClose: false })

                                setIsAddModalOpen(false)
                            } else {
                                toast.error(
                                    <>
                                        <p>{error.status}</p>
                                        <p>{error.error}</p>
                                    </>,
                                    { autoClose: false }
                                )
                            }
                        }}
                    >
                        {isAddingOrganizations ? (
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
                        onClick={async () => {
                            const { error } = await removeOrganizations()

                            if (typeof error === 'undefined') {
                                toast.success('Organisations supprimées', { autoClose: false })

                                setIsRemoveModalOpen(false)
                            } else {
                                toast.error(
                                    <>
                                        <p>{error.status}</p>
                                        <p>{error.error}</p>
                                    </>,
                                    { autoClose: false }
                                )
                            }
                        }}
                    >
                        {isRemovingOrganizations ? (
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
                rowGroupPanelShow="never"
            />
            <Container fluid className="mb-2">
                <p>
                    Ajouter ou supprimer toutes les organisations à/de toutes les formations, sauf l'organisation par
                    défaut :
                </p>
                <Button variant="success" onClick={() => setIsAddModalOpen(true)}>
                    Ajouter organisations
                </Button>{' '}
                <Button variant="danger" onClick={() => setIsRemoveModalOpen(true)}>
                    Supprimer organisations
                </Button>
            </Container>
        </>
    )
}
