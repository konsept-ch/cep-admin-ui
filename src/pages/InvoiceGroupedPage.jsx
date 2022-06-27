import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Container, Button } from 'react-bootstrap'
import Papa from 'papaparse'

import { Grid, EditBtnCellRenderer, InvoiceModal, CommonModal } from '../components'
import { useGetInvoicesQuery } from '../services/invoices'
import { gridContextMenu, downloadCsvFile, formatDate } from '../utils'

export function InvoiceGroupedPage() {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [isSemestrialModalOpen, setIsSemestrialModalOpen] = useState(false)
    const [isAnnualModalOpen, setIsAnnualModalOpen] = useState(false)
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
                <title>Factures groupées - Former22</title>
            </Helmet>
            <Grid
                name="Factures groupées"
                columnDefs={columnDefs}
                rowData={invoicesData}
                isDataLoading={isFetchingInvoices}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openInvoiceEditModal }) }}
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
            <InvoiceModal
                refetchInvoices={refetchInvoices}
                selectedInvoiceData={invoicesData?.find(({ id }) => id === selectedInvoiceId)}
                closeModal={() => {
                    setIsInvoiceModalOpen(false)
                    setSelectedInvoiceId()
                }}
                isModalOpen={isInvoiceModalOpen}
            />
            <CommonModal
                title="Générer factures sémestrielles"
                content={
                    <dl>
                        <dt>Dernière génération de fractures semestrielles :</dt>
                        <dd>{formatDate({ dateString: new Date(), isDateVisible: true })}</dd>
                        <dt>Nombre de factures qui seront générées :</dt>
                        <dd>16</dd>
                        <dt>Nombre de participations affectées :</dt>
                        <dd>116</dd>
                    </dl>
                }
                footer={<Button variant="success">Générer</Button>}
                isVisible={isSemestrialModalOpen}
                onHide={() => setIsSemestrialModalOpen(false)}
            />
            <CommonModal
                title="Générer factures annuelles"
                content={
                    <dl>
                        <dt>Dernière génération de fractures annuelles :</dt>
                        <dd>{formatDate({ dateString: new Date(), isDateVisible: true })}</dd>
                        <dt>Nombre de factures qui seront générées :</dt>
                        <dd>10</dd>
                        <dt>Nombre de participations affectées :</dt>
                        <dd>99</dd>
                    </dl>
                }
                footer={<Button variant="success">Générer</Button>}
                isVisible={isAnnualModalOpen}
                onHide={() => setIsAnnualModalOpen(false)}
            />
            <Container fluid className="mb-2">
                <Button onClick={() => setIsSemestrialModalOpen(true)} className="me-2">
                    Générer des factures groupées semestrielles
                </Button>
                <Button onClick={() => setIsAnnualModalOpen(true)}> Générer des factures groupées annuelles</Button>
            </Container>
        </>
    )
}
