import { useState, useEffect } from 'react'
import { Modal, Button, ListGroup, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { fetchParametersAction } from '../actions/parameters.ts'
import { fetchTemplatePreviewsAction } from '../actions/templates.ts'
import { parametersSelector, loadingSelector, templatePreviewsSelector, templatesLoadingSelector } from '../reducers'
import { statusWarnings, formatDate } from '../utils'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'
import { ConfirmInscriptionChangeButton } from '.'

export const StatusUpdateModal = ({ closeModal, statusUpdateData, updateStatus }) => {
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const parameters = useSelector(parametersSelector)
    const isSagaLoading = useSelector(loadingSelector)
    const areTemplatesLoading = useSelector(templatesLoadingSelector)
    const templatePreviews = useSelector(templatePreviewsSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchParametersAction())
    }, [])

    const isEmailTemplateSelected = selectedTemplateData !== null && selectedTemplateData.templateId !== 'no-email'

    const fetchTemplatePreviews = ({ templateId }) => {
        dispatch(
            fetchTemplatePreviewsAction({
                templateId,
                sessionId: statusUpdateData.session.id,
                inscriptionId: statusUpdateData.id,
            })
        )
    }

    const emailTemplates = parameters?.emailTemplates
        ? parameters.emailTemplates.filter((template) =>
              template.statuses.find((status) => status.value === statusUpdateData.newStatus)
          )
        : []

    return (
        <Modal
            show
            onHide={() => closeModal()}
            backdrop="static"
            keyboard={false}
            dialogClassName="status-change-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title as="h3">Changer le statut d'inscription</Modal.Title>
            </Modal.Header>
            <Modal.Body className="row">
                {statusWarnings[statusUpdateData.status]?.[statusUpdateData.newStatus] && (
                    <div className="col-sm-12">
                        <Alert variant="warning">
                            {statusWarnings[statusUpdateData.status][statusUpdateData.newStatus]}
                        </Alert>
                    </div>
                )}
                <div className="col">
                    <h6>Détails de l'inscription</h6>
                    <dl>
                        <dt>Date d'inscription</dt>
                        <dd>{formatDate({ dateString: statusUpdateData.inscriptionDate, isDateVisible: true })}</dd>
                        <dt>Statut actuel de l'inscription</dt>
                        <dd>{statusUpdateData.status}</dd>
                    </dl>
                    <hr />
                    <dl>
                        <dt>Nom du participant</dt>
                        <dd>{`${statusUpdateData.user.firstName} ${statusUpdateData.user.lastName}`}</dd>
                        <dt>E-mail du participant</dt>
                        <dd>
                            <a href={`mailto:${statusUpdateData.user.email}`}>{statusUpdateData.user.email}</a>
                        </dd>
                        <dt>Profession du participant</dt>
                        <dd>{statusUpdateData.user.profession}</dd>
                        <dt>Numéro de téléphone du participant</dt>
                        <dd>{statusUpdateData.user.phone}</dd>
                    </dl>
                    <hr />
                    <dl>
                        <dt>Nom de la session</dt>
                        <dd>{statusUpdateData.session.name}</dd>
                        <dt>Date de début</dt>
                        <dd>{formatDate({ dateString: statusUpdateData.session.startDate, isDateVisible: true })}</dd>
                        <dt>Statut de la session</dt>
                        <dd>(à faire - invitée)</dd>
                    </dl>
                </div>
                <div className="col">
                    <Alert variant="primary">
                        <h6>Nouveau statut</h6>
                        <Alert.Heading as="h3" className="mb-0">
                            {statusUpdateData.newStatus}
                        </Alert.Heading>
                    </Alert>
                    <h6>Choix de modèle</h6>
                    <ListGroup>
                        <ListGroup.Item
                            onClick={() =>
                                setSelectedTemplateData({
                                    templateId: 'no-email',
                                    emailBody: 'Aucun e-mail ne sera envoyé',
                                    emailSubject: null,
                                })
                            }
                            className={classNames({
                                'active-template': selectedTemplateData?.templateId === 'no-email',
                            })}
                        >
                            <h4>Aucun e-mail</h4>
                            <p>Aucun e-mail ne sera envoyé</p>
                        </ListGroup.Item>
                        {emailTemplates.length > 0 &&
                            emailTemplates.map(({ title, descriptionText, emailBody, templateId, emailSubject }) => (
                                <ListGroup.Item
                                    key={templateId}
                                    onClick={() => {
                                        setSelectedTemplateData({ emailBody, templateId, emailSubject })
                                        fetchTemplatePreviews({ templateId })
                                    }}
                                    className={classNames({
                                        'active-template': selectedTemplateData?.templateId === templateId,
                                    })}
                                >
                                    <h4>{title}</h4>
                                    <p>{descriptionText}</p>
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </div>
                <div className="col template-preview">
                    <h6>Aperçu de l'e-mail</h6>
                    {isEmailTemplateSelected ? (
                        <dl>
                            <dt>Sujet de l'email</dt>
                            <dd>
                                {!areTemplatesLoading ? (
                                    <EmailTemplateBodyInput
                                        className="email-preview"
                                        onChange={() => {}}
                                        value={{
                                            value: templatePreviews.emailSubject,
                                            templateId: selectedTemplateData.templateId,
                                        }}
                                        readOnly
                                    />
                                ) : (
                                    <Spinner animation="grow" size="sm" />
                                )}
                            </dd>
                            <dt>Corps de l'e-mail</dt>
                            <dd>
                                {!areTemplatesLoading ? (
                                    <EmailTemplateBodyInput
                                        className="email-preview"
                                        onChange={() => {}}
                                        value={{
                                            value: templatePreviews.emailContent,
                                            templateId: selectedTemplateData.templateId,
                                        }}
                                        readOnly
                                    />
                                ) : (
                                    <Spinner animation="grow" size="sm" />
                                )}
                            </dd>
                            <dt>Corps de l'SMS</dt>
                            <dd>
                                {!areTemplatesLoading ? (
                                    <EmailTemplateBodyInput
                                        className="email-preview"
                                        onChange={() => {}}
                                        value={{
                                            value: templatePreviews.smsContent,
                                            templateId: selectedTemplateData.templateId,
                                        }}
                                        readOnly
                                    />
                                ) : (
                                    <Spinner animation="grow" size="sm" />
                                )}
                            </dd>
                        </dl>
                    ) : selectedTemplateData?.templateId === 'no-email' ? (
                        'Aucun e-mail ne sera envoyé'
                    ) : (
                        'Sélectionnez un modèle'
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <ConfirmInscriptionChangeButton
                    isSelectedTemplateDataNull={selectedTemplateData === null}
                    isLoading={isSagaLoading}
                    variant="primary"
                    onClick={() => {
                        const templateId =
                            selectedTemplateData?.templateId === 'no-email' ? null : selectedTemplateData.templateId

                        updateStatus({ emailTemplateId: templateId, shouldSendSms: false })
                    }}
                >
                    Confirmer
                </ConfirmInscriptionChangeButton>
                <ConfirmInscriptionChangeButton
                    isSelectedTemplateDataNull={selectedTemplateData === null}
                    isLoading={isSagaLoading}
                    variant="warning"
                    onClick={() => {
                        const templateId =
                            selectedTemplateData?.templateId === 'no-email' ? null : selectedTemplateData.templateId

                        updateStatus({ emailTemplateId: templateId, shouldSendSms: true })
                    }}
                >
                    Confirmer avec SMS
                </ConfirmInscriptionChangeButton>
                <Button
                    variant="outline-primary"
                    onClick={() => {
                        closeModal()
                    }}
                >
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
