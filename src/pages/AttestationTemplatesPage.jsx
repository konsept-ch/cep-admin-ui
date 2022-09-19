import { useState, useMemo } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrash, faPlusLarge } from '@fortawesome/pro-regular-svg-icons'

import { AttestationModelItem, CommonModal } from '../components'
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
        () => templates?.find(({ uuid }) => uuid === selectedTemplateUuid)?.fileOriginalName,
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

        const { error } = await updateAttestation({ uuid: selectedTemplateUuid, formData })

        if (error == null) {
            toast.success("Modèle d'attestation modifiée")
        } else {
            toast.error("Erreur de modification du modèle d'attestation", { autoClose: false })
        }

        reset({ title, description, file: {} })

        await refetch()
    })

    const onDeleteButtonClick = async ({ shouldForceDelete }) => {
        const { error } = await deleteAttestation({ uuid: selectedTemplateUuid, shouldForceDelete })

        if (error.status === 400) {
            toast.error("Ce modèle d'attestation a déjà été utilisé et ne peut plus être supprimé.", {
                autoClose: false,
            })

            // const RetryToast = ({ closeToast }) => (
            //     <div>
            //         <p>Ce modèle d'attestation a déjà été utilisé.</p>
            //         <p>Si vous le supprimez, il n'y aura plus de trâce dans les inscriptions qui l'ont utilisés.</p>
            //         <Button
            //             className="d-block mb-1"
            //             variant="primary"
            //             onClick={async () => {
            //                 const { error: forceDeleteError } = await deleteAttestation({
            //                     uuid: selectedTemplateUuid,
            //                 })

            //                 closeToast()
            //             }}
            //         >
            //             <FontAwesomeIcon icon={faTrash} /> Forcer la suppression ?
            //         </Button>
            //     </div>
            // )

            toast(
                ({ closeToast }) => (
                    <div>
                        <p>Ce modèle d'attestation a déjà été utilisé.</p>
                        <p>Si vous le supprimez, il n'y aura plus de trâce dans les inscriptions qui l'ont utilisé.</p>
                        <Button
                            className="d-block mb-1"
                            variant="danger"
                            onClick={async () => {
                                await onDeleteButtonClick({ shouldForceDelete: true })

                                closeToast()
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} /> Forcer la suppression ?
                        </Button>
                    </div>
                ),
                {
                    autoClose: false,
                    toastId: `retry-delete`,
                }
            )
        } else if (error) {
            console.error(error)

            toast.error("Erreur de suppression du modèle d'attestation", { autoClose: false })
        } else {
            toast.success("Modèle d'attestation supprimée")

            setSelectedTemplateUuid(null)

            setIsDeleteWarningVisible(false)
        }

        await refetch()
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
                                <ListGroup>
                                    {templates.length > 0 &&
                                        templates.map(({ uuid, title, description }) => (
                                            <AttestationModelItem
                                                {...{
                                                    uuid,
                                                    title,
                                                    description,
                                                    isActive: selectedTemplateUuid === uuid,
                                                    onClick: () => {
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
                                                    },
                                                }}
                                            />
                                        ))}
                                </ListGroup>
                            )}
                            <Button
                                variant="success"
                                disabled={isFetching || isCreating}
                                onClick={onAddButtonClick}
                                className="mt-2"
                            >
                                <FontAwesomeIcon icon={faPlusLarge} />{' '}
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
                                            placeholder="Description de la séance"
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
                                            content={<p>Êtes-vous sûr de vouloir supprimer ce modèle?</p>}
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
                                </>
                            )}
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    )
}
