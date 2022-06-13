import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import { useUpdateInvoiceMutation, useRemoveInvoiceMutation } from '../services/invoices'
import { formatToFlatObject } from '../utils'

export function InvoiceModal({ refetchInvoices, selectedInvoiceData, closeModal, isModalOpen }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm()

    useEffect(() => {
        if (selectedInvoiceData != null) {
            const { participantName, tutorsNames, courseName, sessionName } = selectedInvoiceData

            reset({
                participantName,
                tutorsNames,
                courseName,
                sessionName,
            })
        }
    }, [selectedInvoiceData])

    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateInvoiceMutation()
    const [removeInvoice, { isLoading: isRemovingInvoice }] = useRemoveInvoiceMutation()

    const closeInvoiceModal = () => {
        closeModal()
        refetchInvoices()
    }

    return (
        <>
            <CommonModal
                title="Ajouter une facture"
                content={
                    <Row>
                        <Col>
                            <h6>Détails de la facture</h6>
                            <dl>
                                <dt>Participant</dt>
                                <dd>{selectedInvoiceData?.participantName}</dd>
                                <dt>Formateurs</dt>
                                <dd>{selectedInvoiceData?.tutorsNames}</dd>
                                <dt>Formation</dt>
                                <dd>{selectedInvoiceData?.courseName}</dd>
                                <dt>Session</dt>
                                <dd>{selectedInvoiceData?.sessionName}</dd>
                            </dl>
                        </Col>
                        <Col>
                            <h6>Modifier la facture</h6>
                            <Form.Label>Nom du participant</Form.Label>
                            <Form.Control {...register('participantName')} />
                            <Form.Label>Nom du formateur</Form.Label>
                            <Form.Control {...register('tutorsNames')} />
                            <Form.Label>Formation</Form.Label>
                            <Form.Control {...register('courseName')} />
                            <Form.Label>Session</Form.Label>
                            <Form.Control {...register('sessionName')} />
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
                                            id: selectedInvoiceData.id,
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
                        <OverlayTrigger placement="top" overlay={<Tooltip>Supprimer cette facture</Tooltip>}>
                            <div>
                                <Button variant="danger" onClick={() => setIsDeleteWarningVisible(true)}>
                                    Supprimer
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
            <CommonModal
                title="Supprimer une facture"
                content={<p>Êtes-vous sûr de vouloir supprimer cette facture?</p>}
                footer={
                    <Button
                        variant="danger"
                        onClick={async () => {
                            const { error } = await removeInvoice({ id: selectedInvoiceData.id })

                            if (typeof error === 'undefined') {
                                toast.success('Facture supprimée', { autoClose: false })
                                setIsDeleteWarningVisible(false)
                                closeInvoiceModal()
                            } else {
                                toast.error(
                                    <>
                                        <p>{error.status}</p>
                                        <p>{error.error}</p>
                                    </>,
                                    { autoClose: false }
                                )
                            }
                        }}
                    >
                        {isRemovingInvoice ? (
                            <>
                                <Spinner animation="grow" size="sm" /> Supprimer...
                            </>
                        ) : (
                            'Supprimer'
                        )}
                    </Button>
                }
                isVisible={isDeleteWarningVisible}
                onHide={() => setIsDeleteWarningVisible(false)}
                backdrop="static"
            />
        </>
    )
}
