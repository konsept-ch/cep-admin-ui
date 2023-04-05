import { useState, useEffect } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrash, faPlusLarge } from '@fortawesome/pro-regular-svg-icons'

import { EvaluationModelItem, CommonModal, Block } from '../components'
import titleProps from '../components/blocks/Title'
import {
    useGetEvaluationsQuery,
    useCreateEvaluationMutation,
    useUpdateEvaluationMutation,
    useDeleteEvaluationMutation,
} from '../services/evaluationTemplates'

export function EvaluationTemplatesPage() {
    const {
        data: templates,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetEvaluationsQuery(null, { refetchOnMountOrArgChange: true })
    const [createEvaluation, { isLoading: isCreating }] = useCreateEvaluationMutation()
    const [updateEvaluation, { isLoading: isUpdating }] = useUpdateEvaluationMutation()
    const [deleteEvaluation, { isLoading: isDeleting }] = useDeleteEvaluationMutation()

    const [selectedBlock, setSelectedBlock] = useState(null)
    const [struct, setStruct] = useState([])

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, errors },
    } = useForm()

    useEffect(() => {
        if (selectedBlock)
            setStruct([
                ...struct.slice(0, selectedBlock.index),
                selectedBlock.block,
                ...struct.slice(selectedBlock.index + 1),
            ])
    }, [selectedBlock])

    const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(null)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const resetPreview = (uuid, title, description, structParam) => {
        setSelectedTemplateUuid(uuid)
        setStruct(structParam)
        setSelectedBlock(null)
        reset({
            title,
            description,
        })
    }

    const onAddBlock = () =>
        setStruct([
            ...struct,
            {
                type: titleProps.type,
                ...titleProps.default(),
            },
        ])

    const onRemoveBlock = () => {
        if (!selectedBlock) return
        setStruct([...struct.slice(0, selectedBlock.index), ...struct.slice(selectedBlock.index + 1)])
        setSelectedBlock(null)
    }

    const onAddButtonClick = async () => {
        const { data, error } = await createEvaluation()

        if (error == null) {
            toast.success("Modèle d'évaluation créée")
            resetPreview(data.uuid, data.title, '', [])
        } else {
            toast.error("Erreur de création du modèle d'évaluation", { autoClose: false })
        }

        await refetch()
    }

    const onApplyButtonClick = handleSubmit(async (data) => {
        const { error } = await updateEvaluation({
            uuid: selectedTemplateUuid,
            data,
            struct,
        })

        if (error == null) {
            toast.success("Modèle d'évaluation modifié")
        } else {
            toast.error("Erreur de modification du modèle d'évaluation", { autoClose: false })
        }

        reset(data)

        await refetch()
    })

    const onDeleteButtonClick = async ({ shouldForceDelete }) => {
        const { error } = await deleteEvaluation({ uuid: selectedTemplateUuid, shouldForceDelete })

        if (error?.status === 400) {
            toast.error("Ce modèle d'évaluation a déjà été utilisé et ne peut plus être supprimé.", {
                autoClose: false,
            })

            toast(
                ({ closeToast }) => (
                    <div>
                        <p>Ce modèle d'évaluation a déjà été utilisé.</p>
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

            toast.error("Erreur de suppression du modèle d'évaluation", { autoClose: false })
        } else {
            toast.success("Modèle d'évaluation supprimée")

            setSelectedTemplateUuid(null)

            setIsDeleteWarningVisible(false)
        }

        await refetch()
    }

    return (
        <>
            <Helmet>
                <title>Modèles d'évaluations - Former22</title>
            </Helmet>
            <Container fluid className="templates-page">
                <h1>Modèles d'évaluations</h1>
                {isLoading ? (
                    'Chargement...'
                ) : isError ? (
                    'Erreur de chargement des modèles.'
                ) : (
                    <Row>
                        <Col md="4">
                            {templates.length === 0 ? (
                                <p>Aucun modèle, vous pouvez créer un nouveau</p>
                            ) : (
                                <ListGroup>
                                    {templates.length > 0 &&
                                        templates.map(({ uuid, title, description, struct: structParam }) => (
                                            <EvaluationModelItem
                                                {...{
                                                    key: uuid,
                                                    uuid,
                                                    title,
                                                    description,
                                                    isActive: selectedTemplateUuid === uuid,
                                                    onClick: () => {
                                                        if (selectedTemplateUuid === uuid) return
                                                        if (isDirty) {
                                                            setDiscardWarningData({
                                                                isVisible: true,
                                                                selectNewTemplate: () =>
                                                                    resetPreview(uuid, title, description, structParam),
                                                            })
                                                        } else {
                                                            resetPreview(uuid, title, description, structParam)
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
                        <Col md="5" className="pb-4">
                            {selectedTemplateUuid !== null && (
                                <>
                                    {struct.map((block, i) => (
                                        <Block.Preview
                                            key={i}
                                            selected={i === selectedBlock?.index}
                                            onSelected={() => {
                                                setSelectedBlock({
                                                    index: i,
                                                    block,
                                                })
                                            }}
                                            {...block}
                                        />
                                    ))}
                                    <div className="mt-2">
                                        <Button variant="light" onClick={onAddBlock}>
                                            <FontAwesomeIcon icon={faPlusLarge} className="me-1" />
                                            Ajouter bloc
                                        </Button>
                                        {selectedBlock !== null && (
                                            <Button variant="danger" onClick={onRemoveBlock} className="ms-2">
                                                <FontAwesomeIcon icon={faTrash} className="me-1" />
                                                Supprimer bloc
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </Col>
                        <Col md="3" className="position-relative">
                            {selectedTemplateUuid !== null && (
                                <>
                                    <div>
                                        <label className="mb-2">
                                            <strong>Général</strong>
                                        </label>
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
                                        <FloatingLabel controlId="description" label="Description" className="mb-4">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Description de la séance"
                                                style={{ height: '100px' }}
                                                {...register('description')}
                                            />
                                        </FloatingLabel>
                                    </div>
                                    <div className="sticky-top pt-2">
                                        <div>
                                            <label className="mb-2">
                                                <strong>Propriétés</strong>
                                            </label>
                                            {selectedBlock && (
                                                <Block.Editor
                                                    key={selectedBlock.index}
                                                    {...selectedBlock.block}
                                                    onUpdate={(block) =>
                                                        setSelectedBlock({
                                                            index: selectedBlock.index,
                                                            block,
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <Button
                                                    variant="primary"
                                                    onClick={onApplyButtonClick}
                                                    className="mt-2 me-2"
                                                    disabled={isUpdating || isFetching}
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
