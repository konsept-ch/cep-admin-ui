import { useEffect } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import { useUpdateUserMutation } from '../services/users'

export function EditUserModal({ refetchUsers, selectedUserData, closeModal, isModalOpen }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm()

    useEffect(() => {
        if (selectedUserData != null) {
            reset({
                shouldReceiveSms: Boolean(selectedUserData?.shouldReceiveSms),
                colorCode: selectedUserData?.colorCode ?? '',
                cfNumber: selectedUserData?.cfNumber ?? '',
            })
        }
    }, [selectedUserData, reset])

    const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation()

    const closeUserEditModal = () => {
        closeModal()
        refetchUsers()
    }

    return (
        <CommonModal
            title={`${selectedUserData?.lastName} ${selectedUserData?.firstName}`}
            content={
                <Row>
                    <Col>
                        <h6>Détails de l'utilisateur</h6>
                        {selectedUserData != null && (
                            <dl>
                                <dt>Nom</dt>
                                <dd>{`${selectedUserData?.lastName} ${selectedUserData?.firstName}`}</dd>
                                <dt>E-mail</dt>
                                <dd>{selectedUserData.email}</dd>
                                <dt>Organisation</dt>
                                <dd>{selectedUserData.mainOrganizationName}</dd>
                            </dl>
                        )}
                    </Col>
                    <Col>
                        <h6>Modifier l'utilisateur</h6>
                        <Form.Switch label="Recevoir des SMS" {...register('shouldReceiveSms')} />
                    </Col>
                    <Col>
                        <Form.Label>Code couleur CF</Form.Label>
                        <Form.Control {...register('colorCode')} />
                    </Col>
                    <Col>
                        <Form.Label>Numéro CF</Form.Label>
                        <Form.Control {...register('cfNumber', { valueAsNumber: true })} type="number" />
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
                                onClick={handleSubmit(async ({ shouldReceiveSms, colorCode, cfNumber }) => {
                                    const { error: mutationError } = await updateUser({
                                        id: selectedUserData.id,
                                        body: { shouldReceiveSms, colorCode, cfNumber },
                                    })
                                    if (typeof mutationError === 'undefined') {
                                        closeUserEditModal()
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
                                {isUserUpdating ? (
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
                                    closeUserEditModal()
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </OverlayTrigger>
                </>
            }
            isVisible={isModalOpen}
            onHide={() => closeUserEditModal()}
            backdrop="static"
            dialogClassName="update-modal"
        />
    )
}
