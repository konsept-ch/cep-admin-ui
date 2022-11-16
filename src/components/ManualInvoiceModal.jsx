import { useEffect, useMemo } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { DateTime } from 'luxon'
import classNames from 'classnames'

import { CommonModal } from '../components'
import { useCreateManualInvoiceMutation, useUpdateManualInvoiceMutation } from '../services/manual-invoices'
import { useLazyGetOrganizationsFlatWithAddressQuery } from '../services/organizations'
import { formatToFlatObject } from '../utils'

const getYearFromJsDate = ({ date }) =>
    DateTime.fromJSDate(date, { zone: 'UTC' }).setLocale('fr-CH').toLocaleString({ year: 'numeric' })

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
        formState: { isDirty, errors, touchedFields, isSubmitted },
        watch,
        setValue,
    } = useForm()

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })

    const courseYearWatched = watch('courseYear')

    const [fetchOrganizations, { data: organizations }] = useLazyGetOrganizationsFlatWithAddressQuery()

    const clientWatched = watch('client')

    useEffect(() => {
        const {
            addressTitle,
            postalAddressStreet,
            postalAddressCode,
            postalAddressCountry,
            // postalAddressCountryCode,
            postalAddressDepartment,
            // postalAddressDepartmentCode,
            postalAddressLocality,
        } = organizations?.find(({ uuid }) => uuid === clientWatched.uuid)?.former22_organization ?? {}
        setValue(
            'customClientAddress',
            `${addressTitle ? `${addressTitle}\n` : ''}${
                postalAddressDepartment ? `${postalAddressDepartment}\n` : ''
            }${postalAddressStreet ? `${postalAddressStreet}\n` : ''}${
                postalAddressCode ? `${postalAddressCode} ` : ''
            }${postalAddressLocality ? `${postalAddressLocality}\n` : ''}${postalAddressCountry ?? ''}`
        )
    }, [clientWatched])

    const unitValues = useMemo(
        () => [
            { value: 'jours', label: 'jours' },
            { value: 'heures', label: 'heures' },
            { value: 'forfait', label: 'forfait' },
            { value: 'frais effectifs', label: 'frais effectifs' },
        ],
        []
    )

    const clientOptions = useMemo(
        () =>
            organizations?.map(({ uuid, code, name }) => ({
                value: code,
                label: `${code} - ${name}`,
                uuid,
            })),
        [organizations]
    )

    useEffect(() => {
        if (selectedInvoiceData != null && clientOptions?.length > 0) {
            const {
                organizationUuid,
                // invoiceNumberForCurrentYear,
                customClientEmail,
                customClientAddress,
                invoiceDate,
                courseYear,
                itemDesignations,
                itemUnits,
                itemAmounts,
                itemPrices,
                itemVatCodes,
            } = selectedInvoiceData

            reset({
                client: clientOptions.find(({ uuid }) => uuid === organizationUuid),
                customClientAddress,
                courseYear: new Date(String(courseYear)),
                invoiceDate: new Date(String(invoiceDate)),
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
                courseYear: '',
                invoiceDate: '',
                vatCode: defaultTvaOption,
                items: [defaultEmptyItem],
            })
        }
    }, [selectedInvoiceData, clientOptions])

    useEffect(() => {
        if (isModalOpen) {
            fetchOrganizations()
        }
    }, [isModalOpen])

    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateManualInvoiceMutation()
    const [createInvoice, { isLoading: isInvoiceCreating }] = useCreateManualInvoiceMutation()

    const closeInvoiceModal = () => {
        closeModal()
        refetchInvoices()
    }

    const isEditModal = selectedInvoiceData !== undefined

    // const invoiceCourseYear = {
    //     value: selectedInvoiceData?.courseYear,
    //     label: selectedInvoiceData?.courseYear,
    // }

    console.log(touchedFields)

    return (
        <>
            <CommonModal
                title={isEditModal ? 'Modifier la facture' : 'Ajouter une facture'}
                content={
                    <Form noValidate>
                        <Row>
                            <Col xs={{ offset: 6 }}>
                                <Form.Group className="mb-3" controlId="clientSelect">
                                    <Form.Label>Client</Form.Label>
                                    <Controller
                                        name="client"
                                        control={control}
                                        render={({ field }) => <Select {...field} options={clientOptions} />}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="addressTextarea">
                                    <Form.Label>Adresse de facturation</Form.Label>
                                    <Form.Control as="textarea" rows={5} {...register('customClientAddress')} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="emailInput">
                                    <Form.Label>E-mail</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                        <Form.Control
                                            aria-describedby="inputGroupPrepend"
                                            {...register('customClientEmail', {
                                                required: "L'e-mail est requis",
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: "L'e-mail n'est pas valide",
                                                },
                                            })}
                                            type="email"
                                            isInvalid={Boolean(errors.customClientEmail)}
                                            isValid={
                                                isSubmitted &&
                                                touchedFields.customClientEmail &&
                                                !Boolean(errors.customClientEmail)
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.customClientEmail?.message}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="courseYearInput">
                                    <Form.Label>Année formation</Form.Label> {/* +-1 */}
                                    <InputGroup hasValidation>
                                        <Controller
                                            name="courseYear"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <DatePicker
                                                    selected={value}
                                                    onChange={onChange}
                                                    showYearPicker
                                                    dateFormat="yyyy"
                                                    className={classNames('form-control', {
                                                        'is-invalid': Boolean(errors.courseYear),
                                                    })}
                                                />
                                            )}
                                            rules={{
                                                required: "L'année de formation est requise",
                                            }}
                                        />
                                        <Form.Control type="hidden" isInvalid={Boolean(errors.courseYear)} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.courseYear?.message}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                {isEditModal && (
                                    <>
                                        <Form.Label>Numéro facture: </Form.Label>
                                        {getInvoiceNumber({
                                            courseYear: getYearFromJsDate({ date: courseYearWatched }),
                                            userCode: `${selectedInvoiceData?.user.cfNumber}`.padStart(2, '0'),
                                            invoiceNumberForCurrentYear:
                                                selectedInvoiceData?.invoiceNumberForCurrentYear,
                                        })}
                                    </>
                                )}
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="dateInput">
                                    <Form.Label>Date</Form.Label>
                                    <InputGroup hasValidation>
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

                                                    selected={value}
                                                    onChange={onChange}
                                                    className={classNames('form-control', {
                                                        'is-invalid': Boolean(errors.courseYear),
                                                    })}
                                                />
                                            )}
                                            rules={{
                                                required: 'La date de facture est requise',
                                            }}
                                        />
                                        <Form.Control type="hidden" isInvalid={Boolean(errors.invoiceDate)} />
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.invoiceDate?.message}
                                        </Form.Control.Feedback>
                                    </InputGroup>
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
                                    <strong>Quantité</strong> {/* TODO: positiv */}
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>
                                    <strong>Prix</strong> {/* TODO: peut etre negatif */}
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
                    </Form>
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
                                            console.info(formData)
                                            const { error: updateError } = await createInvoice({
                                                body: {
                                                    ...formData,
                                                    courseYear: Number(
                                                        getYearFromJsDate({ date: formData.courseYear })
                                                    ),
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
