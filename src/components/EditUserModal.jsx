import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import { useUpdateUserMutation } from '../services/users'

export function EditUserModal({ refetchUsers, selectedUserData }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { isDirty },
    } = useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        if (selectedUserData != null) {
            reset({
                shouldReceiveSms: Boolean(selectedUserData?.shouldReceiveSms),
            })
            setIsModalVisible(true)
        }
    }, [selectedUserData, setValue, reset])

    const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation()

    const closeUserEditModal = () => {
        setIsModalVisible(false)
        refetchUsers()
    }

    return (
        <CommonModal
            title={selectedUserData?.fullName}
            content={
                <Row>
                    <Col>
                        <h6>Détails de l'utilisateur</h6>
                        {selectedUserData != null && (
                            <dl>
                                <dt>Nom</dt>
                                <dd>{selectedUserData.fullName}</dd>
                                <dt>E-mail</dt>
                                <dd>{selectedUserData.email}</dd>
                                <dt>Organisation</dt>
                                <dd>{selectedUserData.mainOrganization}</dd>
                            </dl>
                        )}
                    </Col>
                    <Col>
                        <h6>Modifier l'utilisateur</h6>
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
                                    const { error: mutationError } = await updateUser({
                                        id: selectedUserData.id,
                                        body: { shouldReceiveSms },
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
            isVisible={isModalVisible}
            onHide={() => closeUserEditModal()}
            backdrop="static"
            dialogClassName="update-modal"
        />
    )
}
