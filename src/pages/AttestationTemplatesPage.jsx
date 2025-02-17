import { useState, useMemo } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'

import { CommonModal } from '../components'
import {
    useGetAttestationsQuery,
    useCreateAttestationMutation,
    useUpdateAttestationMutation,
    useDeleteAttestationMutation,
} from '../services/attestations'

export function AttestationTemplatesPage() {
    const {
        data: templates = [],
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetAttestationsQuery(null, { refetchOnMountOrArgChange: true })
    const [createAttestation, { isLoading: isCreating }] = useCreateAttestationMutation()
    const [updateAttestation, { isLoading: isUpdating }] = useUpdateAttestationMutation()
    const [deleteAttestation, { isLoading: isDeleting }] = useDeleteAttestationMutation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, errors },
    } = useForm()

    const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(null)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const fileName = useMemo(
        () => templates.find(({ uuid }) => uuid === selectedTemplateUuid)?.fileOriginalName,
        [templates, selectedTemplateUuid]
    )

    const onAddButtonClick = async () => {
        const { data, error } = await createAttestation()

        if (error == null) {
            toast.success("Modèle d'attestation créée")

            setSelectedTemplateUuid(data.uuid)

            reset({ title: data.title, description: data.description, file: {} })
        } else {
            toast.error("Erreur de création du modèle d'attestation", { autoClose: false })
        }

        await refetch()
    }

    const onApplyButtonClick = handleSubmit(async ({ title, description, file }) => {
        const uploadedFile = file[0]
        const formData = new FormData()

        formData.append('title', title)

        if (description != null) {
            formData.append('description', description)
        }

        if (uploadedFile != null) {
            formData.append('file', uploadedFile)
        }

        await updateAttestation({ uuid: selectedTemplateUuid, formData })

        reset({ title, description, file: {} })

        await refetch()
    })

    const onDeleteButtonClick = () => {
        deleteAttestation({ uuid: selectedTemplateUuid })
            .unwrap()
            .then(() => {
                setSelectedTemplateUuid(null)
                setIsDeleteWarningVisible(false)
            })
            .catch(() => {})
            .finally(() => refetch())
    }

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
                                <ListGroup className="template-list">
                                    {templates.map(({ uuid, title, description }) => (
                                        <ListGroup.Item
                                            key={uuid}
                                            onClick={() => {
                                                if (isDirty) {
                                                    setDiscardWarningData({
                                                        isVisible: true,
                                                        selectNewTemplate: () => {
                                                            setSelectedTemplateUuid(uuid)

                                                            reset({ uuid, title, description, file: {} })
                                                        },
                                                    })
                                                } else {
                                                    setSelectedTemplateUuid(uuid)

                                                    reset({ uuid, title, description, file: {} })
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
                                onClick={onAddButtonClick}
                                className="mt-2"
                            >
                                <FontAwesomeIcon icon={faPlus} />{' '}
                                {isCreating ? 'Ajout en cours...' : isFetching ? 'Un instant...' : 'Ajouter'}
                            </Button>
                        </Col>
                        {selectedTemplateUuid !== null && (
                            <Col className="template-preview">
                                <FloatingLabel controlId="title" label="Titre" className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Titre du modèle d'attestation"
                                        isInvalid={errors.title}
                                        {...register('title', {
                                            required: { value: true, message: 'Le titre est requis' },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title?.message}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                                <FloatingLabel controlId="description" label="Description" className="mb-2">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Description du modèle d'attestation"
                                        style={{ height: '100px' }}
                                        {...register('description')}
                                    />
                                </FloatingLabel>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Fichier Word (.docx):</Form.Label>
                                    <Form.Control type="file" {...register('file')} />
                                    <Form.Text className="text-muted">Fichier actuel : {fileName ?? ' '}</Form.Text>
                                </Form.Group>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <Button
                                            variant="primary"
                                            onClick={onApplyButtonClick}
                                            className="mt-2 me-2"
                                            disabled={!isDirty || isUpdating || isFetching}
                                        >
                                            <FontAwesomeIcon icon={faFloppyDisk} />{' '}
                                            {isUpdating ? 'Sauvegarde en cours...' : 'Appliquer'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => setIsDeleteWarningVisible(true)}
                                            className="mt-2"
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                                        </Button>
                                    </div>
                                    <CommonModal
                                        title="Avertissement"
                                        content={
                                            <>
                                                <p>Êtes-vous sûr de vouloir supprimer ce modèle?</p>
                                                <strong>
                                                    Si vous le supprimez, il n'y aura plus de trâce dans les
                                                    inscriptions qui l'ont utilisé.
                                                </strong>
                                            </>
                                        }
                                        footer={
                                            <Button
                                                variant="danger"
                                                disabled={isDeleting}
                                                onClick={onDeleteButtonClick}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />{' '}
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
                                                        onApplyButtonClick()

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
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </>
    )
}
