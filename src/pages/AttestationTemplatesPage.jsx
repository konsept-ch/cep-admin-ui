import { useState } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'

import { CommonModal } from '../components'
import {
    useGetAttestationsQuery,
    useCreateAttestationMutation,
    useUpdateAttestationMutation,
    useDeleteAttestationMutation,
} from '../services/attestations'

export function AttestationTemplatesPage() {
    const {
        data: attestationTemplates,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetAttestationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })
    const [createAttestation, { isLoading: isCreating }] = useCreateAttestationMutation()
    const [updateAttestation, { isLoading: isUpdating }] = useUpdateAttestationMutation()
    const [deleteAttestation, { isLoading: isDeleting }] = useDeleteAttestationMutation()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { isDirty, errors },
    } = useForm()

    const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(null)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const templates = attestationTemplates

    const checkIsTemplateChanged = () =>
        selectedTemplateUuid !== null &&
        templates != null &&
        !equals(
            templates.find(({ uuid }) => uuid === selectedTemplateUuid),
            selectedTemplateUuid
        )

    return (
        <>
            <Helmet>
                <title>Modèles d'attestations - Former22</title>
            </Helmet>
            <Container fluid className="templates-page">
                <h1>Modèles d'attestations</h1>
                {isLoading ? (
                    'Chargement...'
                ) : isError ? (
                    'Erreur de chargement des modèles.'
                ) : (
                    <Row>
                        <Col>
                            {templates.length === 0 ? (
                                <p>Aucun modèle, vous pouvez créer un nouveau</p>
                            ) : (
                                <ListGroup>
                                    {templates.length > 0 &&
                                        templates.map(({ path, title, description, filename, uuid }) => (
                                            <ListGroup.Item
                                                key={uuid}
                                                onClick={() => {
                                                    if (checkIsTemplateChanged()) {
                                                        setDiscardWarningData({
                                                            isVisible: true,
                                                            selectNewTemplate: () => {
                                                                setSelectedTemplateUuid(uuid)

                                                                reset({
                                                                    path,
                                                                    filename,
                                                                    uuid,
                                                                    title,
                                                                    description,
                                                                })
                                                            },
                                                        })
                                                    } else {
                                                        setSelectedTemplateUuid(uuid)

                                                        reset({
                                                            path,
                                                            filename,
                                                            uuid,
                                                            title,
                                                            description,
                                                        })
                                                    }
                                                }}
                                                className={classNames({
                                                    'active-template': selectedTemplateUuid === uuid,
                                                })}
                                            >
                                                <div className="d-flex align-items-start justify-content-between">
                                                    <h4 className="d-inline-block">{title}</h4>
                                                </div>
                                                {description && <p>{description}</p>}
                                            </ListGroup.Item>
                                        ))}
                                </ListGroup>
                            )}
                            <Button
                                variant="success"
                                disabled={isFetching || isCreating}
                                onClick={async () => {
                                    await createAttestation()

                                    await refetch()
                                }}
                                className="mt-2"
                            >
                                {isCreating ? 'Ajout en cours...' : isFetching ? 'Un instant...' : 'Ajouter'}
                            </Button>
                        </Col>
                        <Col className="template-preview">
                            {selectedTemplateUuid !== null && (
                                <>
                                    <FloatingLabel controlId="title" label="Titre" className="mb-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Titre de la séance"
                                            {...register('title')}
                                            // value={selectedTemplateUuid.title}
                                            // onChange={({ target: { value } }) =>
                                            //     setSelectedTemplateUuid({ ...selectedTemplateUuid, title: value })
                                            // }
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="description" label="Description" className="mb-2">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Description de la séance"
                                            style={{ height: '100px' }}
                                            {...register('description')}
                                            // value={selectedTemplateUuid.description}
                                            // onChange={({ target: { value } }) =>
                                            //     setSelectedTemplateUuid({
                                            //         ...selectedTemplateUuid,
                                            //         description: value,
                                            //     })
                                            // }
                                        />
                                    </FloatingLabel>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Fichier Word (.docx):</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            onChange={({ target: { value } }) => {
                                                const formData = new FormData()
                                                formData.append('file', value)
                                                setSelectedTemplateUuid({ ...selectedTemplateUuid, filename: formData })
                                            }}
                                        />
                                    </Form.Group>
                                    <div className="d-flex justify-content-between mb-2">
                                        <div>
                                            <Button
                                                variant="primary"
                                                onClick={async () => {
                                                    handleSubmit(async ({ title, description }) => {
                                                        await updateAttestation({
                                                            uuid: selectedTemplateUuid,
                                                            title,
                                                            description,
                                                        })

                                                        await refetch()
                                                    })()
                                                }}
                                                className="mt-2 me-2"
                                                disabled={!checkIsTemplateChanged() || isUpdating || isFetching}
                                            >
                                                {isUpdating ? 'Sauvegarde en cours...' : 'Appliquer'}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => setIsDeleteWarningVisible(true)}
                                                className="mt-2"
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                        <CommonModal
                                            title="Avertissement"
                                            content={<p>Êtes-vous sûr de vouloir supprimer ce modèle?</p>}
                                            footer={
                                                <Button
                                                    variant="danger"
                                                    disabled={isDeleting}
                                                    onClick={async () => {
                                                        await deleteAttestation({ uuid: selectedTemplateUuid })

                                                        await refetch()

                                                        setSelectedTemplateUuid(null)

                                                        setIsDeleteWarningVisible(false)
                                                    }}
                                                >
                                                    {isDeleting ? 'Supprimer en cours...' : 'Supprimer'}
                                                </Button>
                                            }
                                            isVisible={isDeleteWarningVisible}
                                            onHide={() => setIsDeleteWarningVisible(false)}
                                        />
                                        <CommonModal
                                            title="Avertissement"
                                            content={<p>Êtes-vous sûr de vouloir écarter vos modifications ?</p>}
                                            footer={
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => {
                                                            console.log('update attestation')
                                                            discardWarningData.selectNewTemplate()
                                                            setDiscardWarningData({ isVisible: false })
                                                        }}
                                                        className="me-2"
                                                    >
                                                        Appliquer
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => {
                                                            discardWarningData.selectNewTemplate()
                                                            setDiscardWarningData({ isVisible: false })
                                                        }}
                                                    >
                                                        Écarter modifications
                                                    </Button>
                                                </>
                                            }
                                            isVisible={discardWarningData.isVisible}
                                            onHide={() => setDiscardWarningData({ isVisible: false })}
                                        />
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    )
}
