import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button, Spinner, Row, Form, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { Grid, CommonModal, EditBtnCellRenderer } from '../components'
import { useGetUsersQuery, useUpdateUserMutation } from '../services/users'

export function UsersPage() {
    const { register, handleSubmit, setValue, resetField } = useForm()

    const [selectedUserData, setSelectedUserData] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const {
        data: usersData,
        isFetching,
        refetch: fetchUsers,
    } = useGetUsersQuery(null, { refetchOnMountOrArgChange: true })
    const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation()

    const openUserEditModal = ({ data }) => {
        setSelectedUserData(data)
        setValue('shouldReceiveSms', data.shouldReceiveSms)
        setIsModalVisible(true)
    }

    const closeUserEditModal = () => {
        setIsModalVisible(false)
        setSelectedUserData(null)
        resetField('shouldReceiveSms')
        fetchUsers()
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: 'btnCellRenderer',
            headerTooltip: "Modifier l'utilisateur",
            cellClass: 'edit-user-column',
            maxWidth: 60,
            filter: false,
            sortable: false,
        },
        {
            field: 'firstName',
            headerName: 'Prenom',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le prenom de l'utilisateur",
        },
        {
            field: 'lastName',
            headerName: 'Nom',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le nom de l'utilisateur",
        },
        {
            field: 'email',
            headerName: 'E-mail',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'e-mail de l'utilisateur",
        },
        {
            field: 'mainOrganization',
            headerName: 'Organisation',
            filter: 'agSetColumnFilter',
            headerTooltip: "L'organisation de l'utilisateur",
        },
        {
            field: 'shouldReceiveSms',
            headerName: 'Recevoir des SMS',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Est-ce que cet utilisateur reçoit des SMS',
            valueGetter: ({ data: { shouldReceiveSms } }) => (shouldReceiveSms ? 'Oui' : 'Non'),
        },
    ]

    const rowData = usersData?.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.name,
        email: user.email,
        mainOrganization: user.mainOrganization?.name,
        shouldReceiveSms: user.shouldReceiveSms,
    }))

    return (
        <>
            <Helmet>
                <title>Utilisateurs - Former22</title>
            </Helmet>
            <Grid
                name="Utilisateurs"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
                frameworkComponents={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openUserEditModal }) }}
                onRowDoubleClicked={openUserEditModal}
            />
            {isModalVisible && (
                <CommonModal
                    title="Modifier l'utilisateur"
                    content={
                        <Row>
                            <Col>
                                <h6>Détails de l'utilisateur</h6>
                                <dl>
                                    <dt>Nom</dt>
                                    <dd>{selectedUserData.fullName}</dd>
                                    <dt>E-mail</dt>
                                    <dd>{selectedUserData.email}</dd>
                                    <dt>Organisation</dt>
                                    <dd>{selectedUserData.mainOrganization}</dd>
                                </dl>
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
                    onHide={() => setIsModalVisible(false)}
                    backdrop="static"
                    dialogClassName="user-update-modal"
                />
            )}
        </>
    )
}
