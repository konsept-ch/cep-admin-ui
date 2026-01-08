import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { Grid, ManualInvoiceModal } from '../components'
import {
    useGetManualInvoicesQuery,
    useGetEnumsQuery,
    useUpdateStatusesMutation,
    useGenerateDirectInvoiceMutation,
    useGenerateGroupedInvoiceMutation,
    useDeleteAllInvoicesMutation,
} from '../services/manual-invoices'
import { useLazyGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { useLazyGetUsersQuery } from '../services/users'
import { gridContextMenu, downloadCsvFile } from '../utils'
import { mapPathnameToInvoiceType } from '../constants/invoices'
import {
    PATH_INVOICE,
    PATH_INVOICE_ALL,
    PATH_INVOICE_DIRECT,
    PATH_INVOICE_GROUPED,
    PATH_INVOICE_MANUAL,
} from '../constants/constants'
import { currentRunningEnv } from '../constants/config'

const csvOptions = {
    delimiter: ';',
    quotes: false,
    encoding: 'utf-8',
}

const formatInvoiceDate = ({ value }) =>
    DateTime.fromISO(value, { zone: 'UTC' }).setLocale('fr-CH').toLocaleString(DateTime.DATE_SHORT)

const getDefaultFilterModel = (pathname) => ({
    status: {
        filterType: 'set',
        values:
            mapPathnameToInvoiceType[pathname] == null
                ? ['Envoyée', 'Non transmissible']
                : ['En préparation', 'A traiter', 'Exportée', 'Annulée'],
    },
    invoiceType: ['Directe', 'Groupée', 'Manuelle', 'Quota'].includes(mapPathnameToInvoiceType[pathname])
        ? {
              filterType: 'set',
              values: [mapPathnameToInvoiceType[pathname]],
          }
        : null,
})

export function ManualInvoicesPage() {
    const [isManualInvoiceModalOpen, setIsManualInvoiceModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState()
    const [selectedRowsIds, setSelectedRowsIds] = useState([])

    const [fetchOrganizations, { data: organizations }] = useLazyGetOrganizationsFlatWithAddressQuery()
    const [fetchUsers, { data: users }] = useLazyGetUsersQuery()
    const { data: enums, isLoading: areEnumsLoading, refetch: fetchEnums } = useGetEnumsQuery()
    const [updateStatuses, { isLoading: isStatusesUpdating }] = useUpdateStatusesMutation()
    const [generateDirectInvoices, { isLoading: isGeneratingDirectInvoices }] = useGenerateDirectInvoiceMutation()
    const [generateGroupedInvoices, { isLoading: isGeneratingGroupedInvoices }] = useGenerateGroupedInvoiceMutation()
    const [deleteAllInvoices, { isLoading: isDeletingAllInvoices }] = useDeleteAllInvoicesMutation()

    const location = useLocation()

    const {
        data: invoicesData = [],
        isFetching: isFetchingInvoices,
        refetch: refetchInvoices,
    } = useGetManualInvoicesQuery(null, { refetchOnMountOrArgChange: true })

    const filterStorageKey = useMemo(() => `manualInvoicesFilter:${location.pathname}`, [location.pathname])
    const sortStorageKey = useMemo(() => `manualInvoicesSort:${location.pathname}`, [location.pathname])
    const groupStorageKey = useMemo(() => `manualInvoicesGroup:${location.pathname}`, [location.pathname])
    const resetAllStorageKey = useMemo(() => 'manualInvoicesAllReset', [])

    const defaultFilterModel = useMemo(() => getDefaultFilterModel(location.pathname), [location.pathname])
    const lockedInvoiceType = useMemo(() => mapPathnameToInvoiceType[location.pathname], [location.pathname])
    const applyLockedInvoiceType = useMemo(
        () => (model) => {
            if (lockedInvoiceType == null) {
                return model
            }
            return {
                ...model,
                invoiceType: {
                    filterType: 'set',
                    values: [lockedInvoiceType],
                },
            }
        },
        [lockedInvoiceType]
    )
    const defaultSortModel = useMemo(() => [{ colId: 'invoiceNumber', sort: 'asc', sortIndex: 0 }], [])
    const defaultGroupModel = useMemo(() => [], [])
    const [filterModel, setFilterModel] = useState(() => {
        const stored = sessionStorage.getItem(filterStorageKey)
        if (stored) {
            try {
                return applyLockedInvoiceType(JSON.parse(stored))
            } catch (error) {
                // ignore parse errors and fall back to defaults
            }
        }
        return applyLockedInvoiceType(defaultFilterModel)
    })
    const shouldIgnoreInitialFilterClearRef = useRef(Object.keys(defaultFilterModel ?? {}).length > 0)

    useEffect(() => {
        sessionStorage.setItem(filterStorageKey, JSON.stringify(filterModel))
    }, [filterModel, filterStorageKey])

    useEffect(() => {
        const stored = sessionStorage.getItem(filterStorageKey)
        if (stored) {
            try {
                setFilterModel(applyLockedInvoiceType(JSON.parse(stored)))
                return
            } catch (error) {
                // ignore parse errors and fall back to defaults
            }
        }
        setFilterModel(applyLockedInvoiceType(defaultFilterModel))
    }, [applyLockedInvoiceType, defaultFilterModel, filterStorageKey])
    useEffect(() => {
        shouldIgnoreInitialFilterClearRef.current = Object.keys(defaultFilterModel ?? {}).length > 0
    }, [defaultFilterModel])
    useEffect(() => {
        if (location.pathname !== `/${PATH_INVOICE}/${PATH_INVOICE_ALL}`) return
        const resetToken = sessionStorage.getItem(resetAllStorageKey)
        if (!resetToken) return
        sessionStorage.removeItem(resetAllStorageKey)
        setFilterModel(applyLockedInvoiceType(defaultFilterModel))
    }, [applyLockedInvoiceType, defaultFilterModel, location.pathname, resetAllStorageKey])
    useEffect(() => {
        const handleResetAll = () => {
            if (location.pathname !== `/${PATH_INVOICE}/${PATH_INVOICE_ALL}`) return
            setFilterModel(applyLockedInvoiceType(defaultFilterModel))
        }
        window.addEventListener('manualInvoicesAllReset', handleResetAll)
        return () => window.removeEventListener('manualInvoicesAllReset', handleResetAll)
    }, [applyLockedInvoiceType, defaultFilterModel, location.pathname])

    const [sortModel, setSortModel] = useState(() => {
        const stored = sessionStorage.getItem(sortStorageKey)
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch (error) {
                // ignore parse errors and fall back to defaults
            }
        }
        return defaultSortModel
    })

    useEffect(() => {
        sessionStorage.setItem(sortStorageKey, JSON.stringify(sortModel))
    }, [sortModel, sortStorageKey])

    useEffect(() => {
        const stored = sessionStorage.getItem(sortStorageKey)
        if (stored) {
            try {
                setSortModel(JSON.parse(stored))
                return
            } catch (error) {
                // ignore parse errors and fall back to defaults
            }
        }
        setSortModel(defaultSortModel)
    }, [defaultSortModel, sortStorageKey])

    const [groupModel, setGroupModel] = useState(() => {
        const stored = sessionStorage.getItem(groupStorageKey)
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch (error) {
                // ignore parse errors and fall back to defaults
            }
        }
        return defaultGroupModel
    })

    useEffect(() => {
        sessionStorage.setItem(groupStorageKey, JSON.stringify(groupModel))
    }, [groupModel, groupStorageKey])

    useEffect(() => {
        const stored = sessionStorage.getItem(groupStorageKey)
        if (stored) {
            try {
                setGroupModel(JSON.parse(stored))
                return
            } catch (error) {
                // ignore parse errors and fall back to defaults
            }
        }
        setGroupModel(defaultGroupModel)
    }, [defaultGroupModel, groupStorageKey])

    const openInvoiceEditModal = ({ id }) => {
        if (id == null) return
        setSelectedInvoiceId(id)
        setIsManualInvoiceModalOpen(true)
    }

    const columnDefs = useMemo(
        () => [
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
                        onClick={() => openInvoiceEditModal({ id: data?.id })}
                        disabled={data?.id == null}
                        size="sm"
                        className="edit-button-style"
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                ),
            },
            {
                field: 'number',
                headerName: 'Numéro',
                tooltipField: 'invoiceNumber',
                headerTooltip: 'Numéro de facture',
                filter: 'agTextColumnFilter',
                width: 160,
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
                suppressFiltersToolPanel: lockedInvoiceType != null,
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
                        ?.map(({ price, amount }) => Number(price) * Number(amount))
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
                field: 'sessionCodes',
                headerName: 'Codes sessions',
                tooltipField: 'sessionCodes',
                headerTooltip: 'Les codes des sessions de chaque article',
                filter: 'agTextColumnFilter',
                width: 170,
                valueGetter: ({ data }) =>
                    data?.items
                        ?.map(({ sessionCode }) => sessionCode)
                        .filter(Boolean)
                        .join(', '),
            },
            {
                field: 'participantNames',
                headerName: 'Noms participants',
                tooltipField: 'participantNames',
                headerTooltip: 'Les noms des participants de chaque article',
                filter: 'agTextColumnFilter',
                width: 170,
                valueGetter: ({ data }) =>
                    data?.items
                        ?.map(({ participantName }) => participantName)
                        .filter(Boolean)
                        .join(', '),
            },
            {
                field: 'validationTypes',
                headerName: 'Types de validations par RH',
                tooltipField: 'validationTypes',
                headerTooltip: 'Les types de validations par RH',
                filter: 'agTextColumnFilter',
                width: 170,
                valueGetter: ({ data }) =>
                    data?.items
                        ?.map(({ validationType }) => validationType)
                        .filter((type) => type != null)
                        .join(', '),
            },
            {
                field: 'invoiceType',
                headerName: 'Type',
                tooltipField: 'invoiceType',
                headerTooltip: 'Type de la facture, utilisé pour filtrer selon la page',
                filter: 'agSetColumnFilter',
                width: 150,
            },
        ],
        [lockedInvoiceType]
    )

    const handleFilterChange = ({ api }) => {
        const nextModel = applyLockedInvoiceType(api?.getFilterModel?.() ?? {})
        setFilterModel((previous) => {
            const prevString = JSON.stringify(previous ?? {})
            const nextString = JSON.stringify(nextModel)
            const prevModel = previous ?? {}
            const nextIsEmpty = Object.keys(nextModel).length === 0
            const prevIsEmpty = Object.keys(prevModel).length === 0
            if (shouldIgnoreInitialFilterClearRef.current && nextIsEmpty && !prevIsEmpty) {
                return previous
            }
            shouldIgnoreInitialFilterClearRef.current = false
            return prevString === nextString ? previous : nextModel
        })
    }

    const handleSortChange = ({ columnApi }) => {
        const nextModel = (columnApi?.getColumnState?.() ?? [])
            .filter(({ sort }) => sort != null)
            .map(({ colId, sort, sortIndex }) => ({ colId, sort, sortIndex }))
            .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))

        setSortModel((previous) => {
            const prevString = JSON.stringify(previous ?? [])
            const nextString = JSON.stringify(nextModel)
            return prevString === nextString ? previous : nextModel
        })
    }

    const handleGroupChange = ({ columnApi }) => {
        const nextModel = (columnApi?.getColumnState?.() ?? [])
            .filter(({ rowGroup }) => rowGroup === true)
            .map(({ colId, rowGroupIndex }) => ({ colId, rowGroup: true, rowGroupIndex }))
            .sort((a, b) => (a.rowGroupIndex ?? 0) - (b.rowGroupIndex ?? 0))

        setGroupModel((previous) => {
            const prevString = JSON.stringify(previous ?? [])
            const nextString = JSON.stringify(nextModel)
            return prevString === nextString ? previous : nextModel
        })
    }

    return (
        <>
            <Helmet>
                <title>Factures {mapPathnameToInvoiceType[location.pathname] ?? 'Toute'}s - Former22</title>
            </Helmet>
            <Grid
                name={`Factures ${mapPathnameToInvoiceType[location.pathname] ?? 'Toute'}s`}
                columnDefs={columnDefs}
                rowData={invoicesData}
                isDataLoading={isFetchingInvoices || isStatusesUpdating}
                defaultSortModel={defaultSortModel}
                sortModel={sortModel}
                groupModel={groupModel}
                filterModel={filterModel}
                getContextMenuItems={({ node: { data } }) => [
                    {
                        name: 'Exporter pour Crésus',
                        action: () => {
                            const invoicesToExport = (selectedRowsIds.length > 0 ? invoicesData : [data]).filter(
                                ({ id }) => selectedRowsIds.includes(id)
                            )

                            const csvClient = Papa.unparse(
                                {
                                    fields: [
                                        '`Numéro',
                                        '`Firme',
                                        '`Titre',
                                        '`Nom',
                                        '`Prénom',
                                        '`Adresse',
                                        '`Rue',
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
                                            postalAddressStreet,
                                            postalAddressCode,
                                            postalAddressLocality,
                                            postalAddressCountry,
                                            phone,
                                        } = former22_organization ?? {}

                                        return [
                                            invoiceData.clientNumber,
                                            invoiceData.organizationName,
                                            invoiceData.customClientTitle,
                                            invoiceData.customClientLastname,
                                            invoiceData.customClientFirstname,
                                            (invoiceData.organizationName === 'Compte privé'
                                                ? `${invoiceData.customClientFirstname} ${invoiceData.customClientLastname}\\`
                                                : '') + invoiceData.customClientAddress.replaceAll('\n', '\\'),
                                            postalAddressStreet,
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
                                        '`DateFacture',
                                        '`Concerne',
                                        '`CodeCompta',
                                        '`ANuméro',
                                        '`ADésignation',
                                        '`AUnité',
                                        '`AQuantité',
                                        '`APrix',
                                        '`ACodeTVA',
                                        '`Client',
                                        '`RefClient',
                                        '`DateDébut',
                                        '`DateFin',
                                    ],
                                    data: invoicesToExport.map((invoiceData) => {
                                        const year = new Date(invoiceData.invoiceDate).getFullYear()
                                        return [
                                            invoiceData.number,
                                            formatInvoiceDate({ value: invoiceData.invoiceDate }),
                                            invoiceData.concerns ?? '',
                                            invoiceData.codeCompta ?? '',
                                            invoiceData.items.map(({ number }) => number).join('/'),
                                            invoiceData.items
                                                .map(({ designation }) => designation.replaceAll('\n', '\\'))
                                                .join('/'),
                                            invoiceData.items.map(({ unit }) => unit).join('/'),
                                            invoiceData.items.map(({ amount }) => amount).join('/'),
                                            invoiceData.items.map(({ price }) => price).join('/'),
                                            invoiceData.items.map(({ vatCode }) => vatCode).join('/'),
                                            (invoiceData.organizationName === 'Compte privé'
                                                ? `${invoiceData.customClientFirstname} ${invoiceData.customClientLastname}\\`
                                                : '') + invoiceData.customClientAddress.replaceAll('\n', '\\'),
                                            invoiceData.clientNumber,
                                            new Date(year, 0, 1, 12, 0, 0, 0).toLocaleDateString('fr-CH'),
                                            new Date(year, 11, 31, 12, 0, 0, 0).toLocaleDateString('fr-CH'),
                                        ]
                                    }),
                                },
                                csvOptions
                            )

                            downloadCsvFile({ csv: csvClient, fileName: 'CSV Client pour Crésus' })
                            downloadCsvFile({
                                csv: csvFacture,
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
                onFilterChanged={handleFilterChange}
                onSortChanged={handleSortChange}
                onColumnRowGroupChanged={handleGroupChange}
                onRowSelected={({
                    api: {
                        selectionService: { selectedNodes },
                    },
                }) => {
                    const filteredSelectedRowsIds =
                        Object.values(selectedNodes).reduce(
                            (previous, current) => [
                                ...previous,
                                ...(current?.data?.id != null && typeof previous !== 'undefined'
                                    ? [current.data.id]
                                    : []),
                            ],
                            []
                        ) || []

                    setSelectedRowsIds(filteredSelectedRowsIds)
                }}
            />
            <Container fluid className="mb-2">
                {location.pathname === `/${PATH_INVOICE}/${PATH_INVOICE_DIRECT}` && (
                    <Button
                        variant="secondary"
                        className="me-2"
                        disabled={isGeneratingDirectInvoices}
                        onClick={async () => {
                            const directGenerationResponse = await generateDirectInvoices()

                            if (directGenerationResponse.data != null && directGenerationResponse.error == null) {
                                toast.success('Factures directes générées')
                            }

                            await refetchInvoices()
                        }}
                    >
                        Générer directes (année 2024) {isGeneratingDirectInvoices && '...'}
                    </Button>
                )}
                {location.pathname === `/${PATH_INVOICE}/${PATH_INVOICE_MANUAL}` && (
                    <Button variant="success" className="me-2" onClick={() => setIsManualInvoiceModalOpen(true)}>
                        Créer manuelle
                    </Button>
                )}
                {location.pathname === `/${PATH_INVOICE}/${PATH_INVOICE_GROUPED}` && (
                    <>
                        <Button
                            variant="secondary"
                            className="me-2"
                            disabled={isGeneratingGroupedInvoices}
                            onClick={() =>
                                generateGroupedInvoices().then((response) => {
                                    toast.success(response.data.message)
                                    refetchInvoices()
                                })
                            }
                        >
                            Générer groupée {isGeneratingGroupedInvoices && '...'}
                        </Button>
                    </>
                )}
                {location.pathname === `/${PATH_INVOICE}/${PATH_INVOICE_ALL}` &&
                    (currentRunningEnv.toLowerCase() === 'val' || currentRunningEnv.toLowerCase() === 'local') && (
                        <Button
                            variant="danger"
                            className="me-2"
                            onClick={async () => {
                                const deletionResponse = await deleteAllInvoices()

                                if (deletionResponse.data != null && deletionResponse.error == null) {
                                    toast.success(deletionResponse.data)
                                }

                                await refetchInvoices()
                            }}
                            disabled={isDeletingAllInvoices /* || invoicesData?.length === 0 */}
                        >
                            Supprimer toutes ({currentRunningEnv})
                        </Button>
                    )}
            </Container>
            {isManualInvoiceModalOpen && (
                <ManualInvoiceModal
                    refetchInvoices={refetchInvoices}
                    selectedInvoiceData={invoicesData.find(({ id }) => id === selectedInvoiceId)}
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
