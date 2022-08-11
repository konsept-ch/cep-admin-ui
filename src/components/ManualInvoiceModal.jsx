import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import { CommonModal } from '../components'
import { useUpdateManualInvoiceMutation } from '../services/invoices'
import { useGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { formatToFlatObject } from '../utils'

const getInvoiceNumber = ({ courseYear, userCode, invoiceNumberForCurrentYear }) =>
    ` ${`${courseYear}`?.slice(-2)}${`${userCode}`?.padStart(2, 0)}${`${invoiceNumberForCurrentYear}`?.padStart(4, 0)}`

const defaultEmptyItem = { designation: '', unit: '', amount: 0, price: 0 }

const tvaOptions = [
    { value: '0', label: 'EXONERE' },
    { value: '7.7', label: 'TVA 7.7%' },
]
const defaultTvaOption = tvaOptions[1]

// const currentYear = new Date().getFullYear()

export function ManualInvoiceModal({ refetchInvoices, selectedInvoiceData, closeModal, isModalOpen }) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
        watch,
    } = useForm()

    const [startDate, setStartDate] = useState(new Date())

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })

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
                items: [defaultEmptyItem],
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

    const invoiceCourseYear = {
        value: selectedInvoiceData?.courseYear,
        label: selectedInvoiceData?.courseYear,
    }

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
                                <Form.Control {...register('customClientEmail')} type="email" />
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
                                <Form.Label>Année formation</Form.Label> {/* +-1 */}
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            className="form-control"
                                        />
                                    )}
                                    name="courseYear"
                                />
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
                            <Col xs={1}>
                                <Form.Label>
                                    <strong>Actions</strong>
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Designation</strong>
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Unité</strong>
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Nombre</strong> {/* positiv */}
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Prix</strong> {/* peut etre negatif */}
                                </Form.Label>
                            </Col>
                        </Row>
                        {fields.map(({ id }, index) => (
                            <div key={id}>
                                <Row>
                                    <Col xs={1}>
                                        <Button variant="danger" onClick={() => remove(index)}>
                                            Supprimer
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            as="textarea"
                                            rows="4"
                                            {...register(`items.${index}.designation`)}
                                        />
                                    </Col>
                                    <Col>
                                        <Select
                                            options={[
                                                { value: 'jours', label: 'jours' },
                                                { value: 'heures', label: 'heures' },
                                                { value: 'forfait', label: 'forfait' },
                                                { value: 'frais effectifs', label: 'frais effectifs' },
                                            ]}
                                            defaultValue={{ value: '', label: '' }}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control {...register(`items.${index}.amount`)} type="number" />
                                    </Col>
                                    <Col>
                                        <Form.Control {...register(`items.${index}.price`)} type="number" />
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        ))}

                        <Row>
                            <Col xs={1} />
                            <Col>
                                <Button variant="success" onClick={() => append(defaultEmptyItem)}>
                                    Ajouter
                                </Button>
                            </Col>
                        </Row>
                        <h6>Autres</h6>
                        <Row>
                            <Col />
                            <Col>
                                <Form.Label>TVA</Form.Label>
                                <Select options={tvaOptions} defaultValue={defaultTvaOption} />
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
