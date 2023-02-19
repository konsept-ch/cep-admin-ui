import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/pro-light-svg-icons'

import { Grid, ManualInvoiceModal } from '../components'
import {
    useGetManualInvoicesQuery,
    useGetEnumsQuery,
    useUpdateStatusesMutation,
    useGenerateGroupedInvoiceMutation,
} from '../services/manual-invoices'
import { useLazyGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { useLazyGetUsersQuery } from '../services/users'
import { gridContextMenu, downloadCsvFile } from '../utils'
import { mapPathnameToInvoiceType } from '../constants/invoices'

const csvOptions = {
    delimiter: ';',
    quotes: true,
    encoding: 'utf-8',
}

const deriveInvoiceNumber = ({ data }) =>
    `${`${data?.courseYear}`.slice(-2)}${`${data?.user.cfNumber ?? ''}`.padStart(
        2,
        '0'
    )}${`${data?.invoiceNumberForCurrentYear}`.padStart(4, '0')}`

const formatInvoiceDate = ({ value }) =>
    DateTime.fromISO(value, { zone: 'UTC' }).setLocale('fr-CH').toLocaleString(DateTime.DATE_SHORT)

export function ManualInvoicesPage() {
    const [isManualInvoiceModalOpen, setIsManualInvoiceModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState()
    const [selectedRowsIds, setSelectedRowsIds] = useState([])

    const [fetchOrganizations, { data: organizations }] = useLazyGetOrganizationsFlatWithAddressQuery()
    const [fetchUsers, { data: users }] = useLazyGetUsersQuery()
    const { data: enums, isLoading: areEnumsLoading, refetch: fetchEnums } = useGetEnumsQuery()
    const [updateStatuses, { isLoading: isStatusesUpdating }] = useUpdateStatusesMutation()
    const [generateGroupedInvoices, { isLoading: isGeneratingGroupedInvoices }] = useGenerateGroupedInvoiceMutation()

    const location = useLocation()

    const {
        data: invoicesData,
        isFetching: isFetchingInvoices,
        refetch: refetchInvoices,
    } = useGetManualInvoicesQuery(null, { refetchOnMountOrArgChange: true })

    const openInvoiceEditModal = ({ id }) => {
        setSelectedInvoiceId(id)
        setIsManualInvoiceModalOpen(true)
    }

    const [columnDefs] = useState([
        {
            field: 'edit',
            headerName: '',
            headerTooltip: "Modifier l'utilisateur",
            cellClass: 'edit-column',
            pinned: 'left',
            maxWidth: 60,
            filter: false,
            sortable: false,
            cellRenderer: ({ data }) => (
                <Button
                    variant="primary"
                    onClick={() => openInvoiceEditModal({ id: data.id })}
                    size="sm"
                    className="edit-button-style"
                >
                    <FontAwesomeIcon icon={faPen} />
                </Button>
            ),
        },
        {
            field: 'invoiceNumber',
            headerName: 'Numéro',
            tooltipField: 'invoiceNumber',
            headerTooltip: 'Numéro de facture',
            filter: 'agNumberColumnFilter',
            width: 160,
            valueGetter: deriveInvoiceNumber,
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        {
            field: 'invoiceDate',
            headerName: 'Date de facture',
            tooltipField: 'invoiceDate',
            headerTooltip: 'Date de facture',
            filter: 'agDateColumnFilter',
            width: 170,
            valueFormatter: formatInvoiceDate,
        },
        {
            field: 'client',
            headerName: 'Client',
            tooltipField: 'client',
            headerTooltip: 'Organisation/Utilisateur',
            filter: 'agTextColumnFilter',
            valueGetter: ({ data }) => (data?.organizationCode !== 'NREF' ? data?.organizationName : 'Nom+Prénom'),
        },
        {
            field: 'organizationName',
            headerName: 'Organisation',
            tooltipField: 'organizationName',
            headerTooltip: 'Organisation',
            filter: 'agSetColumnFilter',
            hide: true,
        },
        {
            field: 'status',
            headerName: 'Statut',
            tooltipField: 'statut',
            headerTooltip: 'Statut',
            filter: 'agSetColumnFilter',
            filterParams: {
                newRowAction: 'keep',
            },
            width: 150,
        },
        {
            field: 'courseYear',
            headerName: 'Année',
            tooltipField: 'courseYear',
            headerTooltip: 'Année de formation',
            filter: 'agNumberColumnFilter',
            width: 120,
            hide: true,
        },
        {
            field: 'userFullName',
            headerName: 'Créateur',
            tooltipField: 'userFullName',
            headerTooltip: "Le nom complet de l'utilisateur qui a créé la facture",
            filter: 'agTextColumnFilter',
            valueGetter: ({ data }) => `${data?.user.lastName} ${data?.user.firstName}`,
        },
        {
            field: 'itemAmounts',
            headerName: 'Total hors TVA',
            tooltipField: 'itemAmounts',
            headerTooltip: 'La somme des montants des articles, hors TVA',
            filter: 'agTextColumnFilter',
            width: 170,
            valueGetter: ({ data }) =>
                data?.items
                    ?.map(({ price }) => price)
                    .reduce((a, b) => Number(a) + Number(b), 0)
                    .toFixed(2),
        },
        {
            field: 'itemAmountsWithVat',
            headerName: 'Total avec TVA',
            tooltipField: 'itemAmountsWithVat',
            headerTooltip: 'La somme des montants des articles, avec TVA',
            filter: 'agTextColumnFilter',
            width: 170,
            valueGetter: ({ data }) =>
                data?.items
                    ?.map(
                        ({ price, vatCode, amount }) =>
                            Number(amount) *
                            (vatCode?.value === 'TVA' ? Number(price) + (Number(price) * 7.7) / 100 : Number(price))
                    )
                    .reduce((a, b) => Number(a) + Number(b), 0)
                    .toFixed(2),
        },
        {
            field: 'reason',
            headerName: 'Raison',
            tooltipField: 'reason',
            headerTooltip: 'Raison de la facture, utilisé pour les pénalités',
            filter: 'agSetColumnFilter',
            width: 150,
        },
        {
            field: 'invoiceType',
            headerName: 'Type',
            tooltipField: 'invoiceType',
            headerTooltip: 'Type de la facture, utilisé pour filtrer selon la page',
            filter: 'agSetColumnFilter',
            width: 150,
        },
    ])

    return (
        <>
            <Helmet>
                <title>Factures {mapPathnameToInvoiceType[location.pathname] ?? 'Toute'}s - Former22</title>
            </Helmet>
            <Grid
                name={`Factures ${mapPathnameToInvoiceType[location.pathname] ?? 'Toute'}s`}
                columnDefs={columnDefs}
                rowData={invoicesData}
                isDataLoading={isFetchingInvoices}
                getContextMenuItems={({ node: { data } }) => [
                    {
                        name: 'Exporter pour Crésus',
                        action: () => {
                            const invoicesToExport =
                                selectedRowsIds.length > 0
                                    ? invoicesData.filter(
                                          ({ id, status }) => selectedRowsIds.includes(id) && status === 'A traiter'
                                      )
                                    : [data]

                            const csvClient = Papa.unparse(
                                {
                                    fields: [
                                        '`Numéro',
                                        '`Firme',
                                        '`Titre',
                                        '`Nom',
                                        '`Prénom',
                                        '`Adresse',
                                        '`AdresseFacturation',
                                        '`NPA',
                                        '`Localité',
                                        '`Pays',
                                        '`TélProf',
                                        '`TélEmail',
                                    ],
                                    data: invoicesToExport.map((invoiceData) => {
                                        const { former22_organization } =
                                            organizations?.find(({ uuid }) => uuid === invoiceData.organizationUuid) ??
                                            {}

                                        const {
                                            postalAddressCode,
                                            postalAddressLocality,
                                            postalAddressCountry,
                                            phone,
                                        } = former22_organization ?? {}

                                        return [
                                            invoiceData.clientNumber,
                                            invoiceData.organizationName,
                                            invoiceData.customClientTitle,
                                            invoiceData.customClientFirstname,
                                            invoiceData.customClientLastname,
                                            invoiceData.customClientAddress.replaceAll('\n', '\\'),
                                            invoiceData.customClientAddress.replaceAll('\n', '\\'),
                                            postalAddressCode,
                                            postalAddressLocality,
                                            postalAddressCountry,
                                            phone,
                                            invoiceData.customClientEmail,
                                        ]
                                    }),
                                },
                                csvOptions
                            )

                            const csvFacture = Papa.unparse(
                                {
                                    fields: [
                                        '`Numéro',
                                        '`ACodeTVA',
                                        '`ADésignation',
                                        '`APrix',
                                        '`AQuantité',
                                        '`AUnité',
                                        '`Client',
                                        '`DateFacture',
                                        '`RefClient',
                                    ],
                                    data: invoicesToExport.map((invoiceData) => [
                                        deriveInvoiceNumber({ data: invoiceData }),
                                        invoiceData.items.map(({ vatCode }) => vatCode?.value).join('/'),
                                        invoiceData.items
                                            .map(({ designation }) => designation.replaceAll('\n', '\\'))
                                            .join('/'),
                                        invoiceData.items.map(({ price }) => price).join('/'),
                                        invoiceData.items.map(({ amount }) => amount).join('/'),
                                        invoiceData.items.map(({ unit }) => unit.value).join('/'),
                                        invoiceData.customClientAddress.replaceAll('\n', '\\'),
                                        formatInvoiceDate({ value: invoiceData.invoiceDate }),
                                        invoiceData.clientNumber,
                                    ]),
                                },
                                csvOptions
                            )

                            downloadCsvFile({ csv: csvClient, fileName: 'CSV Client pour Crésus' })
                            downloadCsvFile({
                                csv: csvFacture.replaceAll('/', '"/"'),
                                fileName: 'CSV Facture pour Crésus',
                            })

                            updateStatuses({
                                body: {
                                    uuids: invoicesToExport.map((invoice) => invoice.id),
                                    status: 'Export_e',
                                },
                            })
                                .then((response) => {
                                    toast.success(response.data.message)
                                })
                                .finally(() => {
                                    refetchInvoices()
                                })
                        },
                    },
                    {
                        name: 'Modifier statut',
                        disabled: selectedRowsIds.length === 0,
                        subMenu: areEnumsLoading
                            ? null
                            : Object.entries(enums.invoiceStatuses).map(([prismaStatus, actualStatus]) => ({
                                  name: actualStatus,
                                  action: async () => {
                                      const { error, data: updateStatusesResponse } = await updateStatuses({
                                          body: {
                                              uuids: selectedRowsIds,
                                              status: prismaStatus,
                                          },
                                      })
                                      if (!error) {
                                          toast.success(updateStatusesResponse.message)
                                      }
                                      refetchInvoices()
                                  },
                              })),
                    },
                    'separator',
                    ...gridContextMenu,
                ]}
                onRowSelected={({
                    api: {
                        selectionService: { selectedNodes },
                    },
                }) => {
                    const filteredSelectedRowsIds =
                        Object.values(selectedNodes).reduce(
                            (previous, current) => [
                                ...previous,
                                ...(typeof current !== 'undefined' && typeof previous !== 'undefined'
                                    ? [current.data.id]
                                    : []),
                            ],
                            []
                        ) || []

                    setSelectedRowsIds(filteredSelectedRowsIds)
                }}
                defaultFilterModel={{
                    status: {
                        filterType: 'set',
                        values: ['A traiter', 'En préparation'],
                    },
                    invoiceType:
                        mapPathnameToInvoiceType[location.pathname] != null
                            ? {
                                  filterType: 'set',
                                  values: [mapPathnameToInvoiceType[location.pathname]],
                              }
                            : null,
                }}
                onPathnameChange={(gridApi, pathname) => {
                    gridApi?.setFilterModel({
                        status: {
                            filterType: 'set',
                            values: ['A traiter', 'En préparation'],
                        },
                        invoiceType:
                            mapPathnameToInvoiceType[pathname] != null
                                ? {
                                      filterType: 'set',
                                      values: [mapPathnameToInvoiceType[pathname]],
                                  }
                                : null,
                    })
                }}
            />
            <Container fluid className="mb-2">
                <Button variant="success" className="me-2" onClick={() => setIsManualInvoiceModalOpen(true)}>
                    Créer facture manuelle
                </Button>
                <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() =>
                        generateGroupedInvoices({ type: 'semestrial' }).then((response) => {
                            toast.success(response.data.message)
                            refetchInvoices()
                        })
                    }
                >
                    Générer factures sémestrielles {isGeneratingGroupedInvoices && '...'}
                </Button>
                <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() =>
                        generateGroupedInvoices({ type: 'annual' }).then((response) => {
                            toast.success(response.data.message)
                            refetchInvoices()
                        })
                    }
                >
                    Générer factures annuelles {isGeneratingGroupedInvoices && '...'}
                </Button>
            </Container>
            {isManualInvoiceModalOpen && (
                <ManualInvoiceModal
                    refetchInvoices={refetchInvoices}
                    selectedInvoiceData={invoicesData?.find(({ id }) => id === selectedInvoiceId)}
                    closeModal={() => {
                        setIsManualInvoiceModalOpen(false)
                        setSelectedInvoiceId()
                    }}
                    isModalOpen={isManualInvoiceModalOpen}
                    fetchOrganizations={fetchOrganizations}
                    organizations={organizations}
                    fetchUsers={fetchUsers}
                    users={users}
                    fetchEnums={fetchEnums}
                    enums={enums}
                />
            )}
        </>
    )
}
