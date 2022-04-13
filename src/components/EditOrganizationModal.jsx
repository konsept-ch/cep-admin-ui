import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import { useUpdateOrganizationMutation } from '../services/organizations'

export function EditOrganizationModal({ refetchOrganizations, selectedOrganizationData }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { isDirty },
    } = useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        if (selectedOrganizationData != null) {
            reset({
                billingMode: selectedOrganizationData?.billingMode,
                dailyRate: selectedOrganizationData?.dailyRate,
                flyersCount: selectedOrganizationData?.flyersCount,
                phone: selectedOrganizationData?.phone,
                addressTitle: selectedOrganizationData?.addressTitle,
                postalAddressCountry: selectedOrganizationData?.postalAddressCountry,
                postalAddressCountryCode: selectedOrganizationData?.postalAddressCountryCode,
                postalAddressCode: selectedOrganizationData?.postalAddressCode,
                postalAddressStreet: selectedOrganizationData?.postalAddressStreet,
                postalAddressDepartment: selectedOrganizationData?.postalAddressDepartment,
                postalAddressDepartmentCode: selectedOrganizationData?.postalAddressDepartmentCode,
                postalAddressLocality: selectedOrganizationData?.postalAddressLocality,
            })
            setIsModalVisible(true)
        }
    }, [selectedOrganizationData, setValue, reset])

    const [updateOrganization, { isLoading: isOrganizationUpdating }] = useUpdateOrganizationMutation()

    const closeOrganizationEditModal = () => {
        setIsModalVisible(false)
        refetchOrganizations()
    }

    const hasHierarchy = selectedOrganizationData?.orgHierarchy.length > 1

    return (
        <CommonModal
            title={selectedOrganizationData?.name}
            content={
                <Row>
                    <Col>
                        <h6>Détails</h6>
                        {selectedOrganizationData != null && (
                            <dl>
                                {hasHierarchy && (
                                    <>
                                        <dt>Hiérarchie</dt>
                                        <dd className="organization-hierarchy">
                                            {selectedOrganizationData.orgHierarchy.slice(1).map((current, index) => (
                                                <p>
                                                    {[...Array(index).keys()].map(() => '-')}
                                                    {current}
                                                </p>
                                            ))}
                                        </dd>
                                    </>
                                )}
                                <dt>Code</dt>
                                <dd>{selectedOrganizationData.code}</dd>
                                <dt>E-mail</dt>
                                <dd>{selectedOrganizationData.email}</dd>
                                <dt>Type</dt>
                                <dd>{selectedOrganizationData.type}</dd>
                                <dt>Adresse</dt>
                                <dd className="organization-address">
                                    {[
                                        selectedOrganizationData.postalAddressStreet,
                                        [
                                            selectedOrganizationData.postalAddressCode,
                                            selectedOrganizationData.postalAddressLocality,
                                        ]
                                            .filter(Boolean)
                                            .join(' '),
                                        selectedOrganizationData.postalAddressCountry,
                                    ]
                                        .filter(Boolean)
                                        .join('\n')}
                                </dd>
                            </dl>
                        )}
                    </Col>
                    <Col sm={8}>
                        <h6>Modifier l'organisation</h6>

                        <Row className="mb-3">
                            <Form.Label>Mode de facturation</Form.Label>
                            <Col>
                                <Form.Check
                                    inline
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Pas de facturation"
                                    value="Pas de facturation"
                                />
                                <Form.Check
                                    inline
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Directe"
                                    value="Directe"
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    inline
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Groupée - Semestrielle"
                                    value="Groupée - Semestrielle"
                                />
                                <Form.Check
                                    inline
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Groupée - Annuelle"
                                    value="Groupée - Annuelle"
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    inline
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Frais effectifs"
                                    value="Frais effectifs"
                                />
                                <Form.Check
                                    inline
                                    {...register('billingMode')}
                                    type="radio"
                                    label="Idem niveau supérieur"
                                    value="Idem niveau supérieur"
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4} className="pe-0">
                                <Form.Group className="mb-3" controlId="dailyRate">
                                    <Form.Label>Tarif journalier</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>CHF</InputGroup.Text>
                                        <Form.Control type="number" {...register('dailyRate')} />
                                    </InputGroup>
                                    <Form.Text>Si tarif journalier négocié pour l'ensemble des cours</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col className="pe-0" sm={10}>
                                <Form.Label>Intitulé adresse</Form.Label>
                                <Form.Control as="textarea" {...register('addressTitle')} />
                            </Col>

                            <Col>
                                <Form.Label>Nb flyers</Form.Label>
                                <Form.Control type="number" {...register('flyersCount')} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Pays</Form.Label>
                                <Row className="mb-3">
                                    <Col className="pe-0" sm={8}>
                                        <Form.Control {...register('postalAddressCountry')} />
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Control {...register('postalAddressCountryCode')} />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="postalAddressCode">
                                    <Form.Label>Code postal</Form.Label>
                                    <Form.Control {...register('postalAddressCode')} />
                                </Form.Group>

                                <Form.Group controlId="postalAddressStreet">
                                    <Form.Label>Rue et numéro</Form.Label>
                                    <Form.Control {...register('postalAddressStreet')} />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Label>Département</Form.Label>
                                <Row className="mb-3">
                                    <Col className="pe-0" sm={8}>
                                        <Form.Control {...register('postalAddressDepartment')} />
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Control {...register('postalAddressDepartmentCode')} />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="postalAddressLocality">
                                    <Form.Label>Localité</Form.Label>
                                    <Form.Control {...register('postalAddressLocality')} />
                                </Form.Group>

                                <Form.Group controlId="phone">
                                    <Form.Label>Téléphone</Form.Label>
                                    <Form.Control type="phone" {...register('phone')} />
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
                                onClick={handleSubmit(async ({ shouldReceiveSms }) => {
                                    const { error: mutationError } = await updateOrganization({
                                        id: selectedOrganizationData.id,
                                        body: { field: 'Field', newValue: 'New value' },
                                    })
                                    if (typeof mutationError === 'undefined') {
                                        closeOrganizationEditModal()
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
                                {isOrganizationUpdating ? (
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
                                    closeOrganizationEditModal()
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </OverlayTrigger>
                </>
            }
            isVisible={isModalVisible}
            onHide={() => closeOrganizationEditModal()}
            backdrop="static"
            dialogClassName="user-update-modal"
        />
    )
}
