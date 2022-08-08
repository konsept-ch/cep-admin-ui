import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import { useUpdateManualInvoiceMutation } from '../services/invoices'
import { useGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { formatToFlatObject } from '../utils'

export function ManualInvoiceModal({ refetchInvoices, selectedInvoiceData, closeModal, isModalOpen }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm()

    const { data: organizations, refetch: refetchOrganizations } = useGetOrganizationsFlatWithAddressQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    console.log(organizations)

    useEffect(() => {
        if (selectedInvoiceData != null) {
            const { invoiceReason } = selectedInvoiceData

            reset({
                invoiceReason,
            })
        } else {
            reset({
                invoiceReason: '',
            })
        }
    }, [selectedInvoiceData])

    useEffect(() => {
        if (isModalOpen) {
            refetchOrganizations()
        }
    }, [isModalOpen])

    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateManualInvoiceMutation()

    const closeInvoiceModal = () => {
        closeModal()
        refetchInvoices()
    }

    const isEditModal = selectedInvoiceData !== undefined

    return (
        <>
            <CommonModal
                title="Ajouter une facture"
                content={
                    <Row>
                        <Col>
                            <h6>Détails de la facture</h6>
                        </Col>
                        <Col>
                            <h6>Modifier la facture</h6>
                            <Form.Label>Nom du participant</Form.Label>
                            <Form.Control as="textarea" {...register('invoiceReason')} />
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
                    </>
                }
                isVisible={isModalOpen}
                onHide={() => closeInvoiceModal()}
                backdrop="static"
                dialogClassName="update-modal"
            />
        </>
    )
}
