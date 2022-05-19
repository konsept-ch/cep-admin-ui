import { useEffect } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { CommonModal } from '../components'
import { useUpdateInvoiceMutation, useGetInvoiceOptionsQuery } from '../services/invoices'

export function InvoiceModal({ refetchInvoices, selectedInvoiceData, closeModal, isModalOpen }) {
    const {
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { isDirty },
    } = useForm()

    useEffect(() => {
        if (selectedInvoiceData != null) {
            reset({
                participantName: Boolean(selectedInvoiceData?.participantName),
                formateurName: Boolean(selectedInvoiceData?.formateurName),
                formation: Boolean(selectedInvoiceData?.formation),
                session: Boolean(selectedInvoiceData?.session),
            })
        }
    }, [selectedInvoiceData, setValue, reset])

    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateInvoiceMutation()
    const { data: invoiceOptions, isFetching } = useGetInvoiceOptionsQuery(null, { refetchOnMountOrArgChange: true })

    const closeInvoiceModal = () => {
        closeModal()
        refetchInvoices()
    }

    console.log(invoiceOptions)

    const participantsNames = invoiceOptions?.participantsNames.map((current) => ({
        value: `${current.first_name}-${current.last_name}`,
        label: `${current.first_name} ${current.last_name}`,
    }))

    const coursesNames = invoiceOptions?.coursesNames.map((current) => ({
        value: current.sessionsNames,
        label: current.sessionsNames,
    }))

    const sessionsNames = invoiceOptions?.sessionsNames.map((current) => ({
        value: current.sessionsNames,
        label: current.sessionsNames,
    }))

    return (
        <CommonModal
            title="Ajouter une facture"
            content={
                <Row>
                    <h6>Détails de la facture</h6>
                    <Col>
                        <Form.Label>Nom du participant</Form.Label>
                        <Controller
                            name="participantName"
                            control={control}
                            render={({ field }) => <Select {...field} options={participantsNames} />}
                        />
                        <Form.Label>Nom du formateurs</Form.Label>
                        <Controller
                            name="formateurName"
                            control={control}
                            render={({ field }) => <Select {...field} options={participantsNames} />}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Formation</Form.Label>
                        <Controller
                            name="formation"
                            control={control}
                            render={({ field }) => <Select {...field} options={coursesNames} />}
                        />
                        <Form.Label>Session</Form.Label>
                        <Controller
                            name="session"
                            control={control}
                            render={({ field }) => <Select {...field} options={sessionsNames} />}
                        />
                    </Col>
                </Row>
            }
            footer={
                <>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip>
                                {isDirty ? 'Appliquer la modification' : "Vous n'avez pas fait de modification"}
                            </Tooltip>
                        }
                    >
                        <div>
                            <Button
                                variant="primary"
                                disabled={!isDirty}
                                onClick={handleSubmit(async ({ shouldReceiveSms }) => {
                                    const { error: mutationError } = await updateInvoice({
                                        id: selectedInvoiceData.id,
                                        body: { shouldReceiveSms },
                                    })
                                    if (typeof mutationError === 'undefined') {
                                        closeInvoiceModal()
                                    } else {
                                        toast.error(
                                            <>
                                                <p>{mutationError.status}</p>
                                                <p>{mutationError.error}</p>
                                            </>,
                                            { autoClose: false }
                                        )
                                    }
                                })}
                            >
                                {isInvoiceUpdating ? (
                                    <>
                                        <Spinner animation="grow" size="sm" /> Confirmer...
                                    </>
                                ) : (
                                    'Confirmer'
                                )}
                            </Button>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Annuler votre modification</Tooltip>}>
                        <div>
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    closeInvoiceModal()
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </OverlayTrigger>
                </>
            }
            isVisible={isModalOpen}
            onHide={() => closeInvoiceModal()}
            backdrop="static"
            dialogClassName="update-modal"
        />
    )
}
