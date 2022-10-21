import { useEffect, useState, useMemo } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import { CommonModal } from '../components'
import { useCreateManualInvoiceMutation, useUpdateManualInvoiceMutation } from '../services/manual-invoices'
import { useGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { formatToFlatObject } from '../utils'

const getInvoiceNumber = ({ courseYear, userCode, invoiceNumberForCurrentYear }) =>
    ` ${`${courseYear}`.slice(-2)}${`${userCode}`.padStart(2, 0)}${`${invoiceNumberForCurrentYear}`.padStart(4, 0)}`

const defaultEmptyItem = { designation: '', unit: {}, amount: 0, price: 0 }

const tvaOptions = [
    { value: '0', label: 'EXONERE' },
    { value: '7.7', label: 'TVA 7.7%' },
    { value: '8.1', label: 'TVA 8.1%' },
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

    const unitValues = useMemo(
        () => [
            { value: 'jours', label: 'jours' },
            { value: 'heures', label: 'heures' },
            { value: 'forfait', label: 'forfait' },
            { value: 'frais effectifs', label: 'frais effectifs' },
        ],
        []
    )

    const clientOptions = organizations?.map(({ id, code, name }) => ({
        value: code,
        label: `${code} - ${name}`,
        id,
    }))

    useEffect(() => {
        if (selectedInvoiceData != null) {
            const {
                customClientAddress,
                invoiceReason,
                courseYear,
                invoiceDate,
                vatCode,
                // items,
                customClientEmail,
                // organizationUuid,
            } = selectedInvoiceData

            reset({
                client: '',
                // client: clientOptions.find(({ id }) => id === organizationUuid),
                customClientAddress,
                invoiceReason,
                courseYear: new Date(String(courseYear)),
                invoiceDate,
                vatCode,
                items: [defaultEmptyItem],
                // items: items.map(({ unit, ...restProps }) => ({
                //     ...restProps,
                //     unit: unitValues.find(({ label }) => label === unit),
                // })),
                customClientEmail,
            })
        } else {
            reset({
                client: '',
                customClientAddress: '',
                customClientEmail: '',
                invoiceReason: '',
                courseYear: '',
                invoiceDate: '',
                vatCode: defaultTvaOption,
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
    const [createInvoice, { isLoading: isInvoiceCreating }] = useCreateManualInvoiceMutation()

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
                title={isEditModal ? 'Modifier la facture' : 'Ajouter une facture'}
                content={
                    <>
                        <Row>
                            <Col xs={{ offset: 6 }}>
                                <Form.Group className="mb-3" controlId="clientSelect">
                                    <Form.Label>Client</Form.Label>
                                    <Controller
                                        name="client"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} options={clientOptions} isClearable />
                                        )}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="addressTextarea">
                                    <Form.Label>Adresse de facturation</Form.Label>
                                    <Form.Control as="textarea" {...register('customClientAddress')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="emailInput">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control {...register('customClientEmail')} type="email" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="courseYearInput">
                                    <Form.Label>Année formation</Form.Label> {/* +-1 */}
                                    <Controller
                                        name="courseYear"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <DatePicker
                                                selected={value}
                                                onChange={onChange}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                className="form-control"
                                            />
                                        )}
                                    />
                                </Form.Group>
                                <Form.Label>Numéro facture: </Form.Label>
                                {getInvoiceNumber({
                                    courseYear: courseYearWatched,
                                    userCode: '1',
                                    invoiceNumberForCurrentYear: selectedInvoiceData?.invoiceNumberForCurrentYear,
                                })}
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="dateInput">
                                    <Form.Label>Date</Form.Label>
                                    <Controller
                                        name="invoiceDate"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <DatePicker
                                                // selected={value}
                                                // onChange={onChange}
                                                // showYearPicker
                                                // dateFormat="yyyy"
                                                // TODO: controlled
                                                className="form-control"
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={2}>
                                        <Form.Label>
                                            <strong>Actions</strong>
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <strong>Designation</strong>
                                        </Form.Label>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Unité</strong>
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Quantité</strong> {/* positiv */}
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
                                    <Col xs={6}>
                                        <Row>
                                            <Col xs={2}>
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
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Controller
                                            name={`items.${index}.unit`}
                                            control={control}
                                            render={({ field }) => <Select {...field} options={unitValues} />}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control {...register(`items.${index}.amount`)} type="number" />
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="priceInput">
                                            <Form.Control {...register(`items.${index}.price`)} type="number" />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="vatInput">
                                            <Form.Label>TVA</Form.Label>
                                            <Controller
                                                name="vatCode"
                                                control={control}
                                                render={({ field }) => <Select {...field} options={tvaOptions} />}
                                                // TODO: exonere par defaut
                                            />
                                        </Form.Group>
                                        <Row>
                                            <Col xs={{ offset: 6, span: 2 }}></Col>
                                        </Row>
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
                                        let mutationError
                                        if (isEditModal) {
                                            const { error: updateError } = await updateInvoice({
                                                id: isEditModal ? selectedInvoiceData.id : null,
                                                body: {
                                                    ...formatToFlatObject(formData),
                                                    items: formData.items.map(formatToFlatObject),
                                                },
                                            })

                                            mutationError = updateError
                                        } else {
                                            const { error: updateError } = await createInvoice({
                                                body: {
                                                    ...formatToFlatObject(formData),
                                                    items: formData.items.map(formatToFlatObject),
                                                },
                                            })

                                            mutationError = updateError
                                        }
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
                                    {isInvoiceUpdating || isInvoiceCreating ? (
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
