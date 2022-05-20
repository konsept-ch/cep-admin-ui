import { useEffect } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'

import { CommonModal } from '../components'
import { useUpdateInvoiceMutation } from '../services/invoices'
import { formatToFlatObject } from '../utils'

export function InvoiceModal({ refetchInvoices, selectedInvoiceData, closeModal, isModalOpen, invoiceOptions }) {
    const {
        handleSubmit,
        reset,
        control,
        formState: { isDirty },
    } = useForm()

    const tutorsNames = invoiceOptions?.tutorsNames.map(({ first_name, last_name }) => ({
        value: `${first_name}-${last_name}`,
        label: `${first_name} ${last_name}`,
    }))

    const participantsNames = invoiceOptions?.participantsNames.map(({ first_name, last_name }) => ({
        value: `${first_name}-${last_name}`,
        label: `${first_name} ${last_name}`,
    }))

    const coursesNames = invoiceOptions?.coursesNames.map(({ course_name }) => ({
        value: course_name,
        label: course_name,
    }))

    const sessionsNames = invoiceOptions?.sessionsNames.map(({ course_name }) => ({
        value: course_name,
        label: course_name,
    }))

    useEffect(() => {
        if (selectedInvoiceData != null) {
            const { participantName, formateurName, formation, session } = selectedInvoiceData
            reset({
                participantName: participantsNames?.find(({ label }) => label === participantName),
                formateurName: tutorsNames?.find(({ label }) => label === formateurName),
                formation: coursesNames?.find(({ label }) => label === formation),
                session: sessionsNames?.find(({ label }) => label === session),
            })
        }
    }, [selectedInvoiceData])

    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateInvoiceMutation()

    const closeInvoiceModal = () => {
        closeModal()
        refetchInvoices()
    }

    return (
        <CommonModal
            title="Ajouter une facture"
            content={
                <Row>
                    <Col>
                        <h6>Détails de la facture</h6>
                        <dl>
                            <dt>Participant</dt>
                            <dd>{selectedInvoiceData?.participantName}</dd>
                            <dt>Formateur</dt>
                            <dd>{selectedInvoiceData?.formateurName}</dd>
                            <dt>Formation</dt>
                            <dd>{selectedInvoiceData?.formation}</dd>
                            <dt>Session</dt>
                            <dd>{selectedInvoiceData?.session}</dd>
                        </dl>
                    </Col>
                    <Col>
                        <h6>Modifier la facture</h6>
                        <Form.Label>Nom du participant</Form.Label>
                        <Controller
                            name="participantName"
                            control={control}
                            render={({ field }) => <Select {...field} options={participantsNames} />}
                        />
                        <Form.Label>Nom du formateur</Form.Label>
                        <Controller
                            name="formateurName"
                            control={control}
                            render={({ field }) => <Select {...field} options={tutorsNames} />}
                        />
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
                                onClick={handleSubmit(async (formData) => {
                                    const { error: mutationError } = await updateInvoice({
                                        id: selectedInvoiceData ? selectedInvoiceData.invoiceId : uuidv4(),
                                        body: formatToFlatObject(formData),
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
