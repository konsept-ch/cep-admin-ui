import { useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import { Grid, CommonModal, EditBtnCellRenderer, EditOrganizationModal } from '../components'
import {
    useGetOrganizationsQuery,
    useAddOrganizationsMutation,
    useRemoveOrganizationsMutation,
} from '../services/organizations'

export function OrganizationsPage() {
    const [selectedOrganizationData, setSelectedOrganizationData] = useState(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

    const {
        data: organizations,
        isFetching,
        refetch: refetchOrganizations,
    } = useGetOrganizationsQuery(null, { refetchOnMountOrArgChange: true })
    const [addOrganizations, { isLoading: isAddingOrganizations }] = useAddOrganizationsMutation()
    const [removeOrganizations, { isLoading: isRemovingOrganizations }] = useRemoveOrganizationsMutation()

    const openOrganizationEditModal = ({ data }) => {
        // workaround - passes a new object to trigger reopen when the same row is clicked
        setSelectedOrganizationData({ ...data })
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: 'btnCellRenderer',
            headerTooltip: "Modifier l'organisation",
            cellClass: 'edit-column',
            pinned: 'left',
            maxWidth: 60,
            filter: false,
            sortable: false,
        },
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
        {
            field: 'billingMode',
            headerName: 'Mode de facturation',
            filter: 'agSetColumnFilter',
            headerTooltip: "Le mode de facturation de l'organisation",
            hide: true,
        },
        {
            field: 'dailyRate',
            headerName: 'Tarif journalier',
            filter: 'agNumberColumnFilter',
            headerTooltip: "Si tarif journalier négocié pour l'ensemble des cours",
            type: 'numericColumn',
            hide: true,
        },
        {
            field: 'flyersCount',
            headerName: 'Nb flyers',
            filter: 'agNumberColumnFilter',
            headerTooltip: "Le nombre de flyers de l'organisation",
            type: 'numericColumn',
            hide: true,
        },
        {
            field: 'fullAddress',
            headerName: 'Adresse',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'adresse de l'organisation",
            valueGetter: ({
                data: { postalAddressCountry, postalAddressCode, postalAddressStreet, postalAddressLocality },
            }) =>
                postalAddressStreet || postalAddressCode || postalAddressLocality || postalAddressCountry
                    ? `${postalAddressStreet ?? ''}, ${postalAddressCode ?? ''} ${postalAddressLocality ?? ''}, ${
                          postalAddressCountry ?? ''
                      }`
                    : '',
        },
        {
            field: 'phone',
            headerName: 'Téléphone',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le téléphone de l'organisation",
        },
        {
            field: 'addressTitle',
            headerName: 'Intitulé adresse',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'intitulé adresse de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressCountry',
            headerName: 'Pays',
            filter: 'agSetColumnFilter',
            headerTooltip: "Le pays de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressCountryCode',
            headerName: 'Code pays',
            filter: 'agSetColumnFilter',
            headerTooltip: "Le code pays de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressCode',
            headerName: 'Code postal',
            filter: 'agSetColumnFilter',
            headerTooltip: "Le code postal de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressStreet',
            headerName: 'Rue et numéro',
            filter: 'agTextColumnFilter',
            headerTooltip: "La rue et numéro de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressDepartment',
            headerName: 'Département',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le département de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressDepartmentCode',
            headerName: 'Code département',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le code département de l'organisation",
            hide: true,
        },
        {
            field: 'postalAddressLocality',
            headerName: 'Localité',
            filter: 'agSetColumnFilter',
            headerTooltip: "La localité de l'organisation",
            hide: true,
        },
    ]

    const flattenOrganizations = (
        {
            id,
            name,
            code,
            type,
            children,
            email,
            billingMode,
            dailyRate,
            flyersCount,
            phone,
            addressTitle,
            postalAddressCountry,
            postalAddressCountryCode,
            postalAddressCode,
            postalAddressStreet,
            postalAddressDepartment,
            postalAddressDepartmentCode,
            postalAddressLocality,
        },
        parentName
    ) =>
        [
            {
                id,
                name,
                code,
                email,
                type,
                billingMode,
                dailyRate,
                flyersCount,
                phone,
                addressTitle,
                postalAddressCountry,
                postalAddressCountryCode,
                postalAddressCode,
                postalAddressStreet,
                postalAddressDepartment,
                postalAddressDepartmentCode,
                postalAddressLocality,
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
            <EditOrganizationModal {...{ refetchOrganizations, selectedOrganizationData }} />
            <Grid
                name="Organisations"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
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
                    minWidth: 500,
                    cellRendererParams: {
                        suppressCount: true,
                    },
                }}
                groupDefaultExpanded={1}
                groupIncludeFooter={false}
                rowGroupPanelShow="never"
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openOrganizationEditModal }) }}
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
