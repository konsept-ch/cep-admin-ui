import { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import Papa from 'papaparse'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/pro-light-svg-icons'

import { Grid, ManualInvoiceModal } from '../components'
import { useGetManualInvoicesQuery } from '../services/manual-invoices'
import { useLazyGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { gridContextMenu, downloadCsvFile } from '../utils'

const deriveInvoiceNumber = ({ data }) =>
    `${`${data?.courseYear}`.slice(-2)}${`${data?.user.cfNumber}`.padStart(
        2,
        '0'
    )}${`${data?.invoiceNumberForCurrentYear}`.padStart(4, '0')}`

const formatInvoiceDate = ({ value }) =>
    DateTime.fromISO(value, { zone: 'UTC' }).setLocale('fr-CH').toLocaleString(DateTime.DATE_SHORT)

export function ManualInvoicesPage() {
    const [isManualInvoiceModalOpen, setIsManualInvoiceModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState()

    const [fetchOrganizations, { data: organizations }] = useLazyGetOrganizationsFlatWithAddressQuery()

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
            headerName: 'Numéro de facture',
            tooltipField: 'invoiceNumber',
            headerTooltip: 'Numéro de facture',
            filter: 'agNumberColumnFilter',
            width: 190,
            valueGetter: deriveInvoiceNumber,
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
            field: 'statut',
            headerName: 'Statut',
            tooltipField: 'statut',
            headerTooltip: 'Statut',
            filter: 'agSetColumnFilter',
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
                    // .forEach(console.log)
                    .reduce((a, b) => Number(a) + Number(b), 0)
                    .toFixed(2),
        },
    ])

    return (
        <>
            <Helmet>
                <title>Factures manuelles - Former22</title>
            </Helmet>
            <Grid
                name="Factures manuelles"
                columnDefs={columnDefs}
                rowData={invoicesData}
                isDataLoading={isFetchingInvoices}
                getContextMenuItems={({
                    node: { data },
                    columnApi: {
                        columnModel: { columnDefs: gridColumnDefs },
                    },
                }) => [
                    {
                        name: 'Exporter pour Crésus',
                        action: () => {
                            const { former22_organization } =
                                organizations?.find(({ uuid }) => uuid === data.organizationUuid) ?? {}

                            const {
                                addressTitle,
                                postalAddressStreet,
                                postalAddressCode,
                                postalAddressLocality,
                                postalAddressCountry,
                                // postalAddressCountryCode,
                                postalAddressDepartment,
                                // postalAddressDepartmentCode,
                                phone,
                            } = former22_organization ?? {}

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
                                    data: [
                                        [
                                            data.clientNumber,
                                            data.organizationName,
                                            '', // only if private
                                            '', // only if private
                                            '', // only if private
                                            postalAddressStreet,
                                            data.customClientAddress.replaceAll('\n', '\\'),
                                            postalAddressCode,
                                            postalAddressLocality,
                                            postalAddressCountry,
                                            phone,
                                            data.customClientEmail,
                                        ],
                                    ],
                                },
                                {
                                    delimiter: ';',
                                    quotes: true,
                                }
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
                                        // '`RefArticles',
                                        '`RefClient',
                                    ],
                                    data: [
                                        [
                                            deriveInvoiceNumber({ data }),
                                            data.items.map(({ vatCode }) => vatCode?.value).join('/'), // TVA ou EXONERE vatCode
                                            data.items
                                                .map(({ designation }) => designation.replaceAll('\n', '\\'))
                                                .join('/'), // avec \ pour les nouvelles lignes designation
                                            data.items.map(({ price }) => price).join('/'), // avec | autour des ""
                                            data.items.map(({ amount }) => amount).join('/'), // amount
                                            data.items.map(({ unit }) => unit.value).join('/'), // unit
                                            data.customClientAddress.replaceAll('\n', '\\'),
                                            formatInvoiceDate({ value: data.invoiceDate }),
                                            // 1000,
                                            data.clientNumber,
                                        ],
                                    ],
                                },
                                {
                                    delimiter: ';',
                                    quotes: true,
                                }
                            )

                            downloadCsvFile({ csv: csvClient, fileName: 'CSV Client pour Crésus' })
                            downloadCsvFile({ csv: csvFacture, fileName: 'CSV Facture pour Crésus' })
                        },
                    },
                    'separator',
                    ...gridContextMenu,
                ]}
            />
            <Container fluid className="mb-2">
                <Button variant="success" className="me-2" onClick={() => setIsManualInvoiceModalOpen(true)}>
                    Créer facture manuelle
                </Button>
            </Container>
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
            />
        </>
    )
}
