import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Container, Button } from 'react-bootstrap'

import { Grid, EditBtnCellRenderer, InvoiceModal } from '../components'
import { useGetInvoicesQuery, useGetInvoiceOptionsQuery } from '../services/invoices'

export function InvoicePage() {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [invoiceModalData, setInvoiceModalData] = useState({})
    const {
        data: invoicesData,
        isFetchingInvoices,
        refetch: refetchInvoices,
    } = useGetInvoicesQuery(null, { refetchOnMountOrArgChange: true })

    const { data: invoiceOptions, isFetchingOptions } = useGetInvoiceOptionsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    const openInvoiceEditModal = ({ data }) => {
        // workaround - passes a new object to trigger reopen when the same row is clicked
        setInvoiceModalData(data)
        setIsInvoiceModalOpen(true)
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: 'btnCellRenderer',
            headerTooltip: "Modifier l'utilisateur",
            cellClass: 'edit-column',
            pinned: 'left',
            maxWidth: 60,
            filter: false,
            sortable: false,
        },
        {
            field: 'participantName',
            headerName: 'Participant',
            tooltipField: 'participantName',
            headerTooltip: 'Le nom du participant',
            filter: 'agTextColumnFilter',
        },
        {
            field: 'formateurName',
            headerName: 'Formateur',
            tooltipField: 'formateurName',
            headerTooltip: 'Le nom du formateur',
            filter: 'agTextColumnFilter',
        },
        {
            field: 'formation',
            headerName: 'Formation',
            tooltipField: 'formation',
            headerTooltip: 'Le nom de la formation',
            filter: 'agTextColumnFilter',
        },
        {
            field: 'session',
            headerName: 'Session',
            tooltipField: 'session',
            headerTooltip: 'Le nom de la session',
            filter: 'agTextColumnFilter',
        },
    ]

    const rowData = invoicesData

    return (
        <>
            <Helmet>
                <title>Factures - Former22</title>
            </Helmet>
            <Grid
                name="Factures"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetchingInvoices || isFetchingOptions}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openInvoiceEditModal }) }}
            />
            <InvoiceModal
                refetchInvoices={refetchInvoices}
                selectedInvoiceData={invoiceModalData}
                closeModal={() => {
                    setIsInvoiceModalOpen(false)
                    setInvoiceModalData({})
                }}
                isModalOpen={isInvoiceModalOpen}
                invoiceOptions={invoiceOptions}
            />
            <Container fluid className="py-2">
                <Button variant="success" onClick={() => openInvoiceEditModal({})}>
                    Ajouter une facture
                </Button>
            </Container>
        </>
    )
}
