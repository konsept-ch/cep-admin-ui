import { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import Papa from 'papaparse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/pro-light-svg-icons'

import { Grid, ManualInvoiceModal } from '../components'
import { useGetManualInvoicesQuery } from '../services/manual-invoices'
import { gridContextMenu, downloadCsvFile } from '../utils'

export function ManualInvoicesPage() {
    const [isManualInvoiceModalOpen, setIsManualInvoiceModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState()

    const {
        data: invoicesData,
        isFetchingInvoices,
        refetch: refetchInvoices,
    } = useGetManualInvoicesQuery(null, { refetchOnMountOrArgChange: true })

    const openInvoiceEditModal = ({ data: { id } }) => {
        setSelectedInvoiceId(id)
        setIsManualInvoiceModalOpen(true)
    }

    const columnDefs = [
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
                    onClick={() => openInvoiceEditModal({ data })}
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
            valueGetter: ({ data }) => `${data?.courseYear}${'1'.padStart(2, '0')}${data?.clientNumber}`,
        },
        {
            field: 'invoiceDate',
            headerName: 'Date de facture',
            tooltipField: 'invoiceDate',
            headerTooltip: 'Date de facture',
            filter: 'agDateColumnFilter',
        },
        {
            field: 'organizationName',
            headerName: 'Organisation',
            tooltipField: 'organizationName',
            headerTooltip: 'Organisation',
            filter: 'agSetColumnFilter',
        },
        {
            field: 'statut',
            headerName: 'Statut',
            tooltipField: 'statut',
            headerTooltip: 'Statut',
            filter: 'agSetColumnFilter',
        },
        {
            field: 'courseYear',
            headerName: 'Année de formation',
            tooltipField: 'courseYear',
            headerTooltip: 'Année de formation',
            filter: 'agNumberColumnFilter',
        },
        {
            field: 'userFullName',
            headerName: 'Créateur',
            tooltipField: 'userFullName',
            headerTooltip: "Le nom complet de l'utilisateur qui a créé la facture",
            filter: 'agTextColumnFilter',
            valueGetter: ({ data }) => `${data.user.lastName} ${data.user.firstName}`,
        },
        {
            field: 'itemAmounts',
            headerName: 'Total hors TVA',
            tooltipField: 'userFullName',
            headerTooltip: 'La somme des montants des articles, hors TVA',
            filter: 'agTextColumnFilter',
            valueGetter: ({ data }) =>
                data.itemAmounts
                    .split('\\')
                    .reduce((a, b) => Number(a) + Number(b))
                    .toFixed(2),
        },
    ]

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
                    node: { data: rowData },
                    columnApi: {
                        columnModel: { columnDefs: gridColumnDefs },
                    },
                }) => [
                    {
                        name: 'Exporter pour Crésus',
                        action: () => {
                            const fieldsData = gridColumnDefs
                                .filter(({ field }) => field !== columnDefs[0].field)
                                .map(({ headerName, field }) => ({ headerName, field }))

                            const fields = fieldsData.map(({ headerName }) => headerName)
                            const data = fieldsData.map(({ field }) => rowData[field])

                            const csv = Papa.unparse({ fields, data })

                            downloadCsvFile({ csv, fileName: 'CSV pour Crésus' })
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
            />
        </>
    )
}
