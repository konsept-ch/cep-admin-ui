import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Container, Button } from 'react-bootstrap'

import { Grid, EditBtnCellRenderer, InvoiceModal } from '../components'
import { useGetInvoicesQuery } from '../services/invoices'

export function InvoicePage() {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [invoiceModalData, setInvoiceModalData] = useState({})
    const {
        data: invoicesData,
        isFetching,
        refetch: refetchInvoices,
    } = useGetInvoicesQuery(null, { refetchOnMountOrArgChange: true })

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
    ]

    const rowData = invoicesData?.map((invoice) => ({
        id: invoice.id,
    }))

    return (
        <>
            <Helmet>
                <title>Factures - Former22</title>
            </Helmet>
            <Grid
                name="Factures"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openInvoiceEditModal }) }}
            />
            <InvoiceModal
                {...{
                    refetchInvoices,
                    selectedInvoiceData: invoiceModalData,
                    closeModal: () => setIsInvoiceModalOpen(false),
                    isModalOpen: isInvoiceModalOpen,
                }}
            />
            <Container fluid className="py-2">
                <Button variant="success" onClick={() => openInvoiceEditModal({})}>
                    Ajouter une facture
                </Button>
            </Container>
        </>
    )
}
