import { useEffect, useState } from 'react'
import { Button, Spinner, Row, Form, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import { useUpdateUserMutation } from '../services/users'

export function EditUserModal({ refetchUsers, selectedUserData }) {
    const { register, handleSubmit, setValue, resetField } = useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        if (selectedUserData != null) {
            setIsModalVisible(true)
            setValue('shouldReceiveSms', selectedUserData.shouldReceiveSms)
        } else {
            resetField('shouldReceiveSms')
        }
    }, [selectedUserData, setValue, resetField])

    const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation()

    const closeUserEditModal = () => {
        setIsModalVisible(false)
        refetchUsers()
    }

    return (
        <CommonModal
            title="Modifier l'utilisateur"
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
                <Button
                    variant="success"
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
                            <Spinner animation="grow" size="sm" /> Appliquer...
                        </>
                    ) : (
                        'Appliquer'
                    )}
                </Button>
            }
            isVisible={isModalVisible}
            onHide={() => closeUserEditModal()}
            backdrop="static"
            dialogClassName="user-update-modal"
        />
    )
}
