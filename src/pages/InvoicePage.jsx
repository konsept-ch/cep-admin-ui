import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Grid, EditBtnCellRenderer, InvoiceModal } from '../components'
import { useGetInvoicesQuery } from '../services/invoices'

export function InvoicePage() {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState()
    const {
        data: invoicesData,
        isFetchingInvoices,
        refetch: refetchInvoices,
    } = useGetInvoicesQuery(null, { refetchOnMountOrArgChange: true })

    const openInvoiceEditModal = ({ data: { id } }) => {
        setSelectedInvoiceId(id)
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
            field: 'tutorsNames',
            headerName: 'Formateur',
            tooltipField: 'tutorsNames',
            headerTooltip: 'Le nom du formateur',
            filter: 'agTextColumnFilter',
        },
        {
            field: 'courseName',
            headerName: 'Formation',
            tooltipField: 'courseName',
            headerTooltip: 'Le nom de la formation',
            filter: 'agTextColumnFilter',
        },
        {
            field: 'sessionName',
            headerName: 'Session',
            tooltipField: 'sessionName',
            headerTooltip: 'Le nom de la session',
            filter: 'agTextColumnFilter',
        },
    ]

    return (
        <>
            <Helmet>
                <title>Factures - Former22</title>
            </Helmet>
            <Grid
                name="Factures"
                columnDefs={columnDefs}
                rowData={invoicesData}
                isDataLoading={isFetchingInvoices}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openInvoiceEditModal }) }}
            />
            <InvoiceModal
                refetchInvoices={refetchInvoices}
                selectedInvoiceData={invoicesData?.find(({ id }) => id === selectedInvoiceId)}
                closeModal={() => {
                    setIsInvoiceModalOpen(false)
                    setSelectedInvoiceId()
                }}
                isModalOpen={isInvoiceModalOpen}
            />
        </>
    )
}
