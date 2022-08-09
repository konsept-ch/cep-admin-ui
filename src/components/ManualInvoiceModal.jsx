import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { CommonModal } from '../components'
import { useUpdateManualInvoiceMutation } from '../services/invoices'
import { useGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { formatToFlatObject } from '../utils'

const getInvoiceNumber = ({ courseYear, userCode, invoiceNumberForCurrentYear }) =>
    ` ${`${courseYear}`?.slice(-2)}${`${userCode}`?.padStart(2, 0)}${`${invoiceNumberForCurrentYear}`?.padStart(4, 0)}`

export function ManualInvoiceModal({ refetchInvoices, selectedInvoiceData, closeModal, isModalOpen }) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
        watch,
    } = useForm()

    const { fields } = useFieldArray({ control, name: 'items' })

    const courseYearWatched = watch('courseYear')

    const { data: organizations, refetch: refetchOrganizations } = useGetOrganizationsFlatWithAddressQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    // console.log(organizations)

    useEffect(() => {
        if (selectedInvoiceData != null) {
            const { customClientAddress, invoiceReason, courseYear, invoiceDate, vatCode, items, customClientEmail } =
                selectedInvoiceData

            reset({
                customClientAddress,
                invoiceReason,
                courseYear,
                invoiceDate,
                vatCode,
                items,
                customClientEmail,
            })
        } else {
            reset({
                customClientAddress: '',
                customClientEmail: '',
                invoiceReason: '',
                courseYear: '',
                invoiceDate: '',
                vatCode: '',
                items: [],
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
                    <>
                        <Row>
                            <Col>
                                <h6>Modifier la facture</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col />
                            <Col>
                                <Form.Label>Client</Form.Label>
                                <Select
                                    options={organizations?.map(({ code, name }) => ({
                                        value: code,
                                        label: `${code} - ${name}`,
                                    }))}
                                    isClearable
                                />
                                <Form.Label>Adresse postale</Form.Label>
                                <Form.Control as="textarea" {...register('customClientAddress')} />
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control {...register('customClientEmail')} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Concerne</Form.Label>
                                <Form.Control {...register('invoiceReason')} />
                            </Col>
                            <Col />
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Année formation</Form.Label>
                                <Form.Control {...register('courseYear')} />
                                <Form.Label>Numéro facture: </Form.Label>

                                {getInvoiceNumber({
                                    courseYear: courseYearWatched,
                                    userCode: '1',
                                    invoiceNumberForCurrentYear: selectedInvoiceData?.invoiceNumberForCurrentYear,
                                })}
                            </Col>
                            <Col>
                                <Form.Label>Date de facture</Form.Label>
                                <Form.Control {...register('invoiceDate')} />
                            </Col>
                        </Row>
                        <h6>Articles</h6>
                        <Row>
                            <Col>
                                <Form.Label>Designation</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Unité</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Nombre</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Prix</Form.Label>
                            </Col>
                        </Row>
                        {selectedInvoiceData?.items?.map(({ designation, unit, amount, price }, index) => (
                            <>
                                <Row key={index}>
                                    <Col>
                                        <Form.Control
                                            as="textarea"
                                            rows="4"
                                            {...register(`items.${index}.designation`)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control {...register(`items.${index}.unit`)} />
                                    </Col>
                                    <Col>
                                        <Form.Control {...register(`items.${index}.amount`)} />
                                    </Col>
                                    <Col>
                                        <Form.Control {...register(`items.${index}.price`)} />
                                    </Col>
                                </Row>
                                <hr />
                            </>
                        ))}
                        <h6>Autres</h6>
                        <Row>
                            <Col />
                            <Col>
                                <Form.Label>TVA</Form.Label>
                                <Form.Control {...register('vatCode')} />
                            </Col>
                        </Row>
                    </>
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
