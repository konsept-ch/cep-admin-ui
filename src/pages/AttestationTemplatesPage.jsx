import { useState, useMemo } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge } from 'react-bootstrap'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { CommonModal } from '../components'
import {
    useGetAttestationsQuery,
    useCreateAttestationMutation,
    useUpdateAttestationMutation,
    useDeleteAttestationMutation,
} from '../services/attestations'

export function AttestationTemplatesPage() {
    const {
        data: templates,
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
        reset,
        formState: { isDirty, errors },
    } = useForm()

    const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(null)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const fileName = useMemo(
        () => templates?.find(({ uuid }) => uuid === selectedTemplateUuid)?.fileOriginalName,
        [templates, selectedTemplateUuid]
    )

    const onApplyButtonClick = handleSubmit(async ({ title, description, file }) => {
        const uploadedFile = file[0]
        const formData = new FormData()
        formData.append('file', uploadedFile)
        formData.append('title', title)
        formData.append('description', description)

        const { error } = await updateAttestation({ uuid: selectedTemplateUuid, formData })

        if (error == null) {
            toast.success("Modèle d'attestation modifiée")
        } else {
            toast.error("Erreur de modification du modèle d'attestation")
        }

        await refetch()
    })

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
                                        templates.map(({ title, description, uuid }) => (
                                            <ListGroup.Item
                                                key={uuid}
                                                onClick={() => {
                                                    if (isDirty) {
                                                        setDiscardWarningData({
                                                            isVisible: true,
                                                            selectNewTemplate: () => {
                                                                setSelectedTemplateUuid(uuid)

                                                                reset({ uuid, title, description })
                                                            },
                                                        })
                                                    } else {
                                                        setSelectedTemplateUuid(uuid)

                                                        reset({ uuid, title, description })
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
                                    const { error } = await createAttestation()

                                    if (error == null) {
                                        toast.success("Modèle d'attestation créée")
                                    } else {
                                        toast.error("Erreur de création du modèle d'attestation")
                                    }

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
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="description" label="Description" className="mb-2">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Description de la séance"
                                            style={{ height: '100px' }}
                                            {...register('description')}
                                        />
                                    </FloatingLabel>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Fichier Word (.docx):</Form.Label>
                                        <Form.Control
                                            type="file"
                                            {...register('file')}
                                            // accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            // onChange={({ target: { value } }) => {
                                            //     const formData = new FormData()
                                            //     formData.append('file', value)
                                            //     setSelectedTemplateUuid({ ...selectedTemplateUuid, filename: formData })
                                            // }}
                                        />
                                        <Form.Text className="text-muted">Fichier actuel : {fileName ?? ' '}</Form.Text>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between mb-2">
                                        <div>
                                            <Button
                                                variant="primary"
                                                onClick={async () => {
                                                    onApplyButtonClick()
                                                }}
                                                className="mt-2 me-2"
                                                disabled={!isDirty || isUpdating || isFetching}
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
                                                        const { error } = await deleteAttestation({
                                                            uuid: selectedTemplateUuid,
                                                        })

                                                        if (error == null) {
                                                            toast.success("Modèle d'attestation supprimée")

                                                            setSelectedTemplateUuid(null)

                                                            setIsDeleteWarningVisible(false)

                                                            await refetch()
                                                        } else {
                                                            toast.error("Erreur de suppression du modèle d'attestation")
                                                        }
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
                                </>
                            )}
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    )
}
