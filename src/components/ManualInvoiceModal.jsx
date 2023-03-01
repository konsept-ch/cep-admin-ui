import { useEffect, useMemo } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { DateTime } from 'luxon'
// import { addYears, parseISO } from 'date-fns'
import classNames from 'classnames'

import { CommonModal } from '../components'
import { useCreateManualInvoiceMutation, useUpdateManualInvoiceMutation } from '../services/manual-invoices'

const getYearFromJsDate = ({ date }) => DateTime.fromJSDate(date).setLocale('fr-CH').toLocaleString({ year: 'numeric' })

const getInvoiceNumber = ({ courseYear, userCode, invoiceNumberForCurrentYear }) =>
    ` ${`${courseYear}`.slice(-2)}${`${userCode}`.padStart(2, 0)}${`${invoiceNumberForCurrentYear}`.padStart(4, 0)}`

const defaultEmptyItem = { designation: '', unit: null, amount: 0, price: 0, vatCode: null }

const vatOptions = [
    { value: 'EXONERE', label: 'EXONERE' },
    { value: 'TVA', label: 'TVA 7.7%' },
    { value: 'TAUX1', label: 'TVA incluse' },
]
// const defaultTvaOption = tvaOptions[1]

const unitOptions = [
    { value: 'jour(s)', label: 'jour(s)' },
    { value: 'heure(s)', label: 'heure(s)' },
    { value: 'forfait(s)', label: 'forfait(s)' },
    { value: 'part.', label: 'part.' },
]
export function ManualInvoiceModal({
    refetchInvoices,
    selectedInvoiceData,
    closeModal,
    isModalOpen,
    fetchOrganizations,
    organizations,
    fetchUsers,
    users,
    fetchEnums,
    enums,
}) {
    const { invoiceStatuses, invoiceTypes, invoiceReasons } = enums ?? {}
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

    const clientWatched = watch('client')

    useEffect(() => {
        // don't reset if we just opened edit mode
        if (isDirty) {
            const { name, email, former22_organization } =
                organizations?.find(({ uuid }) => uuid === clientWatched.uuid) ?? {}

            const {
                addressTitle,
                postalAddressStreet,
                postalAddressCode,
                postalAddressCountry,
                // postalAddressCountryCode,
                postalAddressDepartment,
                // postalAddressDepartmentCode,
                postalAddressLocality,
            } = former22_organization ?? {}

            setValue(
                'customClientAddress',
                // TODO: calculate custom client address on the server instead
                `${name}\n${addressTitle ? `${addressTitle}\n` : ''}${
                    postalAddressDepartment ? `${postalAddressDepartment}\n` : ''
                }${postalAddressStreet ? `${postalAddressStreet}\n` : ''}${
                    postalAddressCode ? `${postalAddressCode} ` : ''
                }${postalAddressLocality ? `${postalAddressLocality}\n` : ''}${postalAddressCountry ?? ''}`
            )
            setValue('customClientEmail', email)
        } else {
            if (selectedInvoiceData != null) {
                const { customClientEmail, customClientAddress } = selectedInvoiceData

                setValue('customClientAddress', customClientAddress)
                setValue('customClientEmail', customClientEmail)
            }
        }
    }, [clientWatched])

    const clientOptions = useMemo(
        () =>
            organizations?.map(({ uuid, code, name }) => ({
                value: code,
                label: `${code} - ${name}`,
                uuid,
            })),
        [organizations]
    )

    const statusesOptions = useMemo(
        () =>
            invoiceStatuses != null
                ? Object.entries(invoiceStatuses).map(([prismaStatus, actualStatus]) => ({
                      value: prismaStatus,
                      label: actualStatus,
                  }))
                : null,
        [invoiceStatuses]
    )

    const invoiceTypeOptions = useMemo(
        () =>
            invoiceTypes != null
                ? Object.entries(invoiceTypes).map(([prismaInvoiceType, actualInvoiceType]) => ({
                      value: prismaInvoiceType,
                      label: actualInvoiceType,
                  }))
                : null,
        [invoiceTypes]
    )

    const reasonOptions = useMemo(
        () =>
            invoiceReasons != null
                ? Object.entries(invoiceReasons).map(([prismaInvoiceReason, actualInvoiceReason]) => ({
                      value: prismaInvoiceReason,
                      label: actualInvoiceReason,
                  }))
                : null,
        [invoiceReasons]
    )

    const userOptions = useMemo(
        () =>
            users?.map(({ id, email, firstName, lastName }) => ({
                value: id,
                label: `${firstName} ${lastName} <${email}>`,
                uuid: id,
            })),
        [users]
    )

    useEffect(() => {
        if (selectedInvoiceData != null) {
            const {
                organizationUuid,
                customClientEmail,
                customClientAddress,
                customClientTitle,
                customClientFirstname,
                customClientLastname,
                invoiceDate,
                courseYear,
                items,
                selectedUserUuid,
                concerns,
                status,
                invoiceType,
                reason,
            } = selectedInvoiceData

            reset({
                client: clientOptions?.find(({ uuid }) => uuid === organizationUuid),
                selectedUser: userOptions?.find(({ uuid }) => uuid === selectedUserUuid),
                status: statusesOptions?.find(({ label }) => label === status),
                customClientAddress,
                customClientEmail,
                customClientTitle,
                customClientFirstname,
                customClientLastname,
                courseYear: new Date(String(courseYear)),
                invoiceDate: new Date(String(invoiceDate)),
                items: items.map(({ vatCode, unit, ...rest }) => ({
                    ...rest,
                    vatCode: vatOptions?.find(({ value }) => value === vatCode),
                    unit: unitOptions?.find(({ value }) => value === unit),
                })),
                concerns,
                invoiceType: invoiceTypeOptions?.find(({ label }) => label === invoiceType),
                reason: reasonOptions?.find(({ label }) => label === reason),
            })
        } else {
            reset({
                client: '',
                customClientAddress: '',
                customClientEmail: '',
                customClientTitle: '',
                customClientFirstname: '',
                customClientLastname: '',
                courseYear: '',
                invoiceDate: '',
                concerns: '',
                invoiceType: invoiceTypeOptions?.find(({ label }) => label === 'Manuelle'),
                reason: reasonOptions?.find(({ label }) => label === 'Participation'),
                items: [defaultEmptyItem],
                status: statusesOptions?.find(({ label }) => label === 'En préparation'),
            })
        }
    }, [selectedInvoiceData, clientOptions, userOptions, statusesOptions])

    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateManualInvoiceMutation()
    const [createInvoice, { isLoading: isInvoiceCreating }] = useCreateManualInvoiceMutation()

    useEffect(() => {
        if (isModalOpen) {
            fetchEnums()
            fetchOrganizations()
            fetchUsers()
        }
    }, [isModalOpen])

    const closeInvoiceModal = () => {
        closeModal()
        refetchInvoices()
    }

    const isEditModal = selectedInvoiceData !== undefined

    return (
        <>
            <CommonModal
                title={isEditModal ? 'Modifier la facture' : 'Ajouter une facture'}
                content={
                    <Form noValidate>
                        <Row>
                            <Col>
                                {statusesOptions ? (
                                    <Form.Group className="mb-3" controlId="statut">
                                        <Form.Label>Statut</Form.Label>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={statusesOptions}
                                                    defaultValue={statusesOptions.find(
                                                        ({ label }) => label === 'En préparation'
                                                    )}
                                                />
                                            )}
                                        />
                                    </Form.Group>
                                ) : (
                                    'Chargement des statuts...'
                                )}
                                <Form.Group className="mb-3" controlId="invoiceType">
                                    <Form.Label>Type de facture</Form.Label>
                                    <Controller
                                        name="invoiceType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} isDisabled={true} options={invoiceTypeOptions} />
                                        )}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="reason">
                                    <Form.Label>Raison</Form.Label>
                                    <Controller
                                        name="reason"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} isDisabled={isEditModal} options={reasonOptions} />
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="clientSelect">
                                    <Form.Label>Client</Form.Label>
                                    <Controller
                                        name="client"
                                        control={control}
                                        render={({ field }) => <Select {...field} options={clientOptions} />}
                                    />
                                </Form.Group>
                                {clientWatched?.value === 'DEFAUT-PRIVÉ' && (
                                    <>
                                        <Form.Group className="mb-3" controlId="userSelect">
                                            <Form.Label>Utilisateur</Form.Label>
                                            <Controller
                                                name="selectedUser"
                                                control={control}
                                                render={({ field }) => <Select {...field} options={userOptions} />}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="customClientTitle">
                                            <Form.Label>Titre</Form.Label>
                                            <Form.Control {...register('customClientTitle')} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="customClientFirstname">
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control {...register('customClientFirstname')} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="customClientLastname">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control {...register('customClientLastname')} />
                                        </Form.Group>
                                    </>
                                )}
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
                                                    // includeDates={[new Date(), addYears(new Date(), 1)]}
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
                            <Col>
                                <Form.Group className="mb-3" controlId="concerns">
                                    <Form.Label>Concerne</Form.Label>
                                    <Form.Control {...register('concerns')} />
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
                                            render={({ field }) => <Select {...field} options={unitOptions} />}
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
                                                name={`items.${index}.vatCode`}
                                                control={control}
                                                render={({ field }) => <Select {...field} options={vatOptions} />}
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

                                        const requestBody = {
                                            ...formData,
                                            courseYear: Number(getYearFromJsDate({ date: formData.courseYear })),
                                            selectedUserUuid: formData.selectedUser?.value,
                                        }

                                        if (isEditModal) {
                                            const { error: updateError } = await updateInvoice({
                                                id: selectedInvoiceData.id,
                                                body: requestBody,
                                            })

                                            mutationError = updateError
                                        } else {
                                            const { error: createError } = await createInvoice({
                                                body: requestBody,
                                            })

                                            mutationError = createError
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
