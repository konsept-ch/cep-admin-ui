import { useState } from 'react'
import Select from 'react-select'
import { ListGroup, Row, Col, Container, Badge, Button, FloatingLabel, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'

import { CommonModal } from '../components'
import { inscriptionStatuses } from '../utils'
import {
    useGetTemplatesQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
    useInviteTemplateMutation,
} from '../services/templates'
import { EmailTemplateBodyInput } from '../components/EmailTemplateBodyInput'

export function TemplatesPage() {
    const {
        data: templates,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetTemplatesQuery(null, { refetchOnMountOrArgChange: true })
    const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation()
    const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation()
    const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation()
    const [inviteTemplate, { isLoading: isInviting }] = useInviteTemplateMutation()

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { isDirty, errors },
    } = useForm()

    const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(null)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [isSessionInvitesModalVisible, setIsSessionInvitesModalVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const onAddButtonClick = async () => {
        const { data, error } = await createTemplate()

        if (error == null) {
            toast.success("Modèle d'e-mail créée")

            setSelectedTemplateUuid(data.templateId)

            reset({ title: data.title, description: data.description })
        } else {
            toast.error("Erreur de création du modèle d'e-mail", { autoClose: false })
        }

        await refetch()
    }

    const onApplyButtonClick = handleSubmit(async (data) => {
        const { error } = await updateTemplate({
            uuid: selectedTemplateUuid,
            data,
        })

        if (error == null) {
            toast.success("Modèle d'e-mail modifiée")
        } else {
            toast.error("Erreur de modification du modèle d'e-mail", { autoClose: false })
        }

        reset(data)

        await refetch()
    })

    const onDeleteButtonClick = async () => {
        const { error } = await deleteTemplate({ uuid: selectedTemplateUuid })

        if (error) {
            toast.error("Erreur de suppression du modèle d'e-mail", { autoClose: false })
        } else {
            toast.success("Modèle d'e-mail supprimée")

            setSelectedTemplateUuid(null)

            setIsDeleteWarningVisible(false)
        }

        await refetch()
    }

    const onInviteTemplate = async () => {
        await inviteTemplate({ uuid: selectedTemplateUuid })
        await refetch()
        setIsSessionInvitesModalVisible(false)
    }

    return (
        <>
            <Helmet>
                <title>Modèles d'e-mails - Former22</title>
            </Helmet>
            <Container fluid className="templates-page">
                <h1>Modèles d'e-mails</h1>
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
                                    {templates.length > 0 &&
                                        templates.map(
                                            ({
                                                templateId,
                                                title,
                                                descriptionText,
                                                emailSubject,
                                                emailBody,
                                                smsBody,
                                                statuses,
                                                usedByEvaluation,
                                                isUsedForSessionInvites,
                                            }) => (
                                                <ListGroup.Item
                                                    key={templateId}
                                                    className={classNames({
                                                        'active-template': selectedTemplateUuid === templateId,
                                                    })}
                                                    onClick={() => {
                                                        if (isDirty) {
                                                            setDiscardWarningData({
                                                                isVisible: true,
                                                                selectNewTemplate: () => {
                                                                    setSelectedTemplateUuid(templateId)

                                                                    reset({
                                                                        templateId,
                                                                        title,
                                                                        descriptionText,
                                                                        emailSubject,
                                                                        emailBody,
                                                                        smsBody,
                                                                        statuses,
                                                                        usedByEvaluation,
                                                                    })
                                                                },
                                                            })
                                                        } else {
                                                            setSelectedTemplateUuid(templateId)

                                                            reset({
                                                                templateId,
                                                                title,
                                                                descriptionText,
                                                                emailSubject,
                                                                emailBody,
                                                                smsBody,
                                                                statuses,
                                                                usedByEvaluation,
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <div className="d-flex align-items-start justify-content-between">
                                                        <h4 className="d-inline-block">{title}</h4>
                                                        {isUsedForSessionInvites && (
                                                            <Badge bg="warning" text="dark">
                                                                Sessions invitées
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {descriptionText && <p>{descriptionText}</p>}
                                                </ListGroup.Item>
                                            )
                                        )}
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
                                        {...register('descriptionText')}
                                    />
                                </FloatingLabel>
                                <label className="mt-2">Sujet de l'e-mail :</label>
                                <Controller
                                    name="emailSubject"
                                    control={control}
                                    render={({ field }) => (
                                        <EmailTemplateBodyInput
                                            className="email-subject-input"
                                            templateId={selectedTemplateUuid}
                                            onChange={field.onChange}
                                            value={field.value}
                                            shouldHaveVariables
                                            isEmailSubjectInput
                                        />
                                    )}
                                />
                                <label>Corps de l'e-mail :</label>
                                <Controller
                                    name="emailBody"
                                    control={control}
                                    render={({ field }) => (
                                        <EmailTemplateBodyInput
                                            className="email-body-input"
                                            templateId={selectedTemplateUuid}
                                            onChange={field.onChange}
                                            value={field.value}
                                            shouldHandleKeyCommand
                                            shouldHaveVariables
                                            shouldHaveBlockTag
                                        />
                                    )}
                                />
                                <label>Texte de l'SMS :</label>
                                <Controller
                                    name="smsBody"
                                    control={control}
                                    render={({ field }) => (
                                        <EmailTemplateBodyInput
                                            className="email-body-input"
                                            templateId={selectedTemplateUuid}
                                            onChange={field.onChange}
                                            value={field.value}
                                            shouldHaveVariables
                                        />
                                    )}
                                />
                                <label>Valable pour statuts :</label>
                                <Controller
                                    name="statuses"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            closeMenuOnSelect={false}
                                            isMulti
                                            options={inscriptionStatuses.map((current) => ({
                                                value: current,
                                                label: current,
                                            }))}
                                        />
                                    )}
                                />
                                <Form.Check
                                    className="mt-2"
                                    type="checkbox"
                                    label="Valable pour évaluation"
                                    {...register('usedByEvaluation')}
                                />
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
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsSessionInvitesModalVisible(true)}
                                        className="mt-2"
                                    >
                                        {isInviting ? 'Changement en cours...' : 'Utiliser pour sessions invitées'}
                                    </Button>
                                    <CommonModal
                                        title="Modèle pour sessions invitées"
                                        content={
                                            <p>
                                                Êtes-vous sûr de vouloir ce modèle pour les invitations à une session ?
                                            </p>
                                        }
                                        footer={
                                            <Button variant="secondary" onClick={onInviteTemplate}>
                                                Utiliser
                                            </Button>
                                        }
                                        isVisible={isSessionInvitesModalVisible}
                                        onHide={() => setIsSessionInvitesModalVisible(false)}
                                    />
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
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </>
    )
}
