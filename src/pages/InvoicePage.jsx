import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Papa from 'papaparse'

import { Grid, EditBtnCellRenderer, InvoiceModal } from '../components'
import { useGetInvoicesQuery, useGetCresusDataMutation } from '../services/invoices'
import { gridContextMenu, downloadCsvFile, formatDate } from '../utils'

export function InvoicePage() {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState()
    const {
        data: invoicesData,
        isFetchingInvoices,
        refetch: refetchInvoices,
    } = useGetInvoicesQuery(null, { refetchOnMountOrArgChange: true })

    const [getCresusData] = useGetCresusDataMutation()

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
        {
            field: 'createdAt',
            headerName: 'Date de création',
            tooltipField: 'createdAt',
            headerTooltip: 'Date de création de facture',
            filter: 'agTextColumnFilter',
            valueGetter: ({ data }) => formatDate({ dateString: data?.createdAt, isDateVisible: true }),
        },
        {
            field: 'inscriptionStatus',
            headerName: "Statut de l'inscription",
            tooltipField: 'inscriptionStatus',
            headerTooltip: "Statut de l'inscription",
            filter: 'agTextColumnFilter',
        },
    ]

    return (
        <>
            <Helmet>
                <title>Factures directes - Former22</title>
            </Helmet>
            <Grid
                name="Factures directes"
                columnDefs={columnDefs}
                rowData={invoicesData}
                isDataLoading={isFetchingInvoices}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openInvoiceEditModal }) }}
                getContextMenuItems={({ node: { data: rowData } }) => [
                    {
                        name: 'Exporter pour Crésus',
                        action: async () => {
                            const { data } = await getCresusData({ invoiceId: rowData.id })
                            downloadCsvFile({ csvArray: data })
                        },
                    },
                    'separator',
                    ...gridContextMenu,
                ]}
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
