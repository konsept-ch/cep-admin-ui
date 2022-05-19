import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

import { CommonModal } from '../components'
import { useUpdateCourseMutation } from '../services/courses'
import { formatToFlatObject, formatDate } from '../utils'

export function EditCourseModal({ refetchCourses, selectedCourseData, adminsData }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { isDirty, errors },
    } = useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)

    const watchIsRecurrent = watch('isRecurrent')

    const typeStageValues = [
        { value: 'attestation', label: 'Attestation' },
        { value: 'certificat', label: 'Certificat' },
        { value: 'autre', label: 'Autre' },
    ]

    const teachingMethodValues = [
        { value: 'présentiel', label: 'Présentiel' },
        { value: 'distanciel', label: 'Distanciel' },
        { value: 'e-learning', label: 'E-learning' },
        { value: 'mixte/blended', label: 'Mixte/Blended' },
    ]

    const codeCategoryValues = [
        { value: 'catalogue', label: 'Catalogue' },
        { value: 'fsm', label: 'FSM' },
        { value: 'ps', label: 'PS' },
        { value: 'cie', label: 'CIE' },
        { value: 'cas', label: 'CAS' },
    ]

    useEffect(() => {
        if (selectedCourseData != null) {
            reset({
                coordinator: adminsData.find(({ label }) => label === selectedCourseData.coordinator),
                responsible: adminsData.find(({ label }) => label === selectedCourseData.responsible),
                typeStage: typeStageValues.find(({ label }) => label === selectedCourseData.typeStage),
                teachingMethod: teachingMethodValues.find(({ label }) => label === selectedCourseData.teachingMethod),
                codeCategory: codeCategoryValues.find(({ label }) => label === selectedCourseData.codeCategory),
                theme: selectedCourseData?.theme,
                targetAudience: selectedCourseData?.targetAudience,
                billingMode: selectedCourseData?.billingMode,
                pricingType: selectedCourseData?.pricingType,
                baseRate: selectedCourseData?.baseRate,
                isRecurrent: selectedCourseData?.isRecurrent,
            })
            setIsModalVisible(true)
        }
    }, [selectedCourseData, setValue, reset])

    const [updateCourse, { isLoading: isCourseUpdating }] = useUpdateCourseMutation()

    const closeCourseEditModal = () => {
        setIsModalVisible(false)
        refetchCourses()
    }

    return (
        <CommonModal
            title={selectedCourseData?.name}
            content={
                <Row>
                    <Col>
                        <h6>Détails</h6>
                        {selectedCourseData != null && (
                            <dl>
                                <dt>Code</dt>
                                <dd>{selectedCourseData.code}</dd>
                                <dt>Durée</dt>
                                <dd>{selectedCourseData.duration}</dd>
                                <dt>Coût</dt>
                                <dd>{selectedCourseData.price}</dd>
                                <dt>Visibilité</dt>
                                <dd>{selectedCourseData.hidden ? 'Cachée' : 'Visible'}</dd>
                                <dt>Date de création</dt>
                                <dd>
                                    {formatDate({ dateString: selectedCourseData.creationDate, isDateVisible: true })}
                                </dd>
                                <dt>Dernière modification</dt>
                                <dd>
                                    {formatDate({
                                        dateString: selectedCourseData.lastModifiedDate,
                                        isDateVisible: true,
                                    })}
                                </dd>
                            </dl>
                        )}
                    </Col>
                    <Col sm={8}>
                        <h6>Modifier la formation</h6>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label>CF (coordinateur)</Form.Label>
                                <Controller
                                    name="coordinator"
                                    control={control}
                                    render={({ field }) => <CreatableSelect {...field} options={adminsData} />}
                                />
                            </Col>
                            <Col>
                                <Form.Label>RF (responsable)</Form.Label>
                                <Controller
                                    name="responsible"
                                    control={control}
                                    render={({ field }) => <CreatableSelect {...field} options={adminsData} />}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Type stage</Form.Label>
                                <Controller
                                    name="typeStage"
                                    control={control}
                                    render={({ field }) => <Select {...field} options={typeStageValues} />}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Méthode enseignement</Form.Label>
                                <Controller
                                    name="teachingMethod"
                                    control={control}
                                    render={({ field }) => <Select {...field} options={teachingMethodValues} />}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Formation Récurrente</Form.Label>
                                <Form.Check {...register('isRecurrent')} type="switch" />
                                <Form.Text>{`La formation ${
                                    watchIsRecurrent ? 'est' : "n'est pas"
                                } récurrente`}</Form.Text>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Code catégorie</Form.Label>
                                <Controller
                                    name="codeCategory"
                                    control={control}
                                    render={({ field }) => <Select {...field} options={codeCategoryValues} />}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Thème</Form.Label>
                                <Form.Control {...register('theme')} />
                            </Col>
                            <Col>
                                <Form.Label>Public cible</Form.Label>
                                <Form.Control {...register('targetAudience')} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Mode de facturation</Form.Label>
                                <Form.Check
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Par participant"
                                    value="Par participant"
                                />
                                <Form.Check
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Par session"
                                    value="Par session"
                                />
                            </Col>
                            <Col>
                                <Form.Label>Tarification</Form.Label>
                                <Form.Check
                                    {...register('pricingType')}
                                    type="radio"
                                    label="Par jour"
                                    value="Par jour"
                                />
                                <Form.Check
                                    {...register('pricingType')}
                                    type="radio"
                                    label="Par cours"
                                    value="Par cours"
                                />
                            </Col>
                            <Col>
                                <Form.Group controlId="baseRate">
                                    <Form.Label>Tarif de base</Form.Label>
                                    <InputGroup className="mb-3" hasValidation>
                                        <InputGroup.Text id="baseRatePrepend">CHF</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            isInvalid={errors?.baseRate}
                                            min={0}
                                            aria-describedby="baseRatePrepend"
                                            {...register('baseRate', {
                                                valueAsNumber: true,
                                                min: { value: 0, message: 'Un nombre positif est nécessaire' },
                                            })}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.baseRate?.message}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <Form.Text>Si tarif de base négocié pour l'ensemble des cours</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
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
                                onClick={handleSubmit(async (newData) => {
                                    const { error: mutationError } = await updateCourse({
                                        courseId: selectedCourseData.id,
                                        newData: formatToFlatObject(newData),
                                    })
                                    if (typeof mutationError === 'undefined') {
                                        closeCourseEditModal()
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
                                {isCourseUpdating ? (
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
                                    closeCourseEditModal()
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </OverlayTrigger>
                </>
            }
            isVisible={isModalVisible}
            onHide={() => closeCourseEditModal()}
            backdrop="static"
            dialogClassName="update-modal"
        />
    )
}
