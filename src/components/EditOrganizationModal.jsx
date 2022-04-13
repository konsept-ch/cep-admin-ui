import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
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
                shouldReceiveSms: Boolean(selectedOrganizationData?.shouldReceiveSms),
            })
            setIsModalVisible(true)
        }
    }, [selectedOrganizationData, setValue, reset])

    const [updateOrganization, { isLoading: isOrganizationUpdating }] = useUpdateOrganizationMutation()

    const closeOrganizationEditModal = () => {
        setIsModalVisible(false)
        refetchOrganizations()
    }

    return (
        <CommonModal
            title={selectedOrganizationData.name}
            content={
                <Row>
                    <Col>
                        <h6>Détails de l'organisation</h6>
                        {selectedOrganizationData != null && (
                            <dl>
                                <dt>Hiérarchie</dt>
                                <dd className="organization-hierarchy">
                                    {selectedOrganizationData.orgHierarchy.map((current, index) => {
                                        return (
                                            <p>
                                                {[...Array(index).keys()].map(() => '-')}
                                                {current}
                                            </p>
                                        )
                                    })}
                                </dd>
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
                    <Col>
                        <h6>Modifier l'organisation</h6>
                        <Form.Switch label="Recevoir des SMS" {...register('shouldReceiveSms')} />
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
