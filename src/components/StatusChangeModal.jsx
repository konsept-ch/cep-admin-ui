import { useState, useEffect } from 'react'
import { Modal, Button, ListGroup, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { fetchParametersAction } from '../actions/parameters.ts'
import { fetchTemplatePreviewsAction } from '../actions/templates.ts'
import { parametersSelector, loadingSelector, templatePreviewsSelector, templatesLoadingSelector } from '../reducers'
import { statusWarnings, formatDate } from '../utils'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'

export const StatusChangeModal = ({ closeModal, statusChangeData, updateStatus }) => {
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
                sessionId: statusChangeData.session.id,
                inscriptionId: statusChangeData.id,
            })
        )
    }

    const emailTemplates = parameters.emailTemplates.filter((template) =>
        template.statuses.find((status) => status.value === statusChangeData.newStatus)
    )

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
                {statusWarnings[statusChangeData.status]?.[statusChangeData.newStatus] && (
                    <div className="col-sm-12">
                        <Alert variant="warning">
                            {statusWarnings[statusChangeData.status][statusChangeData.newStatus]}
                        </Alert>
                    </div>
                )}
                <div className="col">
                    <h6>Détails de l'inscription</h6>
                    <dl>
                        <dt>Date d'inscription</dt>
                        <dd>{formatDate({ dateString: statusChangeData.date, isDateVisible: true })}</dd>
                        <dt>Statut actuel de l'inscription</dt>
                        <dd>{statusChangeData.status}</dd>
                    </dl>
                    <hr />
                    <dl>
                        <dt>Nom du participant</dt>
                        <dd>{statusChangeData.user.name}</dd>
                        <dt>E-mail du participant</dt>
                        <dd>
                            <a href={`mailto:${statusChangeData.user.email}`}>{statusChangeData.user.email}</a>
                        </dd>
                        <dt>Profession du participant</dt>
                        <dd>(à faire)</dd>
                    </dl>
                    <hr />
                    <dl>
                        <dt>Nom de la session</dt>
                        <dd>{statusChangeData.session.name}</dd>
                        <dt>Date de début</dt>
                        <dd>{formatDate({ dateString: statusChangeData.session.restrictions.dates[0] })}</dd>
                        <dt>Statut de la session</dt>
                        <dd>(à faire)</dd>
                    </dl>
                </div>
                <div className="col">
                    <Alert variant="primary">
                        <h6>Nouveau statut</h6>
                        <Alert.Heading as="h3" className="mb-0">
                            {statusChangeData.newStatus}
                        </Alert.Heading>
                    </Alert>
                    <h6>Choix de modèle</h6>
                    <ListGroup>
                        <ListGroup.Item
                            onClick={() =>
                                setSelectedTemplateData({
                                    templateId: 'no-email',
                                    body: 'Aucun e-mail ne sera envoyé',
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
                            emailTemplates.map(({ title, description, body, templateId, emailSubject }) => (
                                <ListGroup.Item
                                    key={templateId}
                                    onClick={() => {
                                        setSelectedTemplateData({ body, templateId, emailSubject })
                                        fetchTemplatePreviews({ templateId })
                                    }}
                                    className={classNames({
                                        'active-template': selectedTemplateData?.templateId === templateId,
                                    })}
                                >
                                    <h4>{title}</h4>
                                    <p>{description}</p>
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
                        </dl>
                    ) : selectedTemplateData?.templateId === 'no-email' ? (
                        'Aucun e-mail ne sera envoyé'
                    ) : (
                        'Sélectionnez un modèle'
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip>
                            {selectedTemplateData === null
                                ? "D'abord sélectionnez un modèle"
                                : 'Appliquer le changement'}
                        </Tooltip>
                    }
                >
                    <div>
                        <Button
                            disabled={selectedTemplateData === null}
                            variant="primary"
                            onClick={() => {
                                const templateId =
                                    selectedTemplateData?.templateId === 'no-email'
                                        ? null
                                        : selectedTemplateData.templateId

                                updateStatus({ emailTemplateId: templateId })
                            }}
                        >
                            {isSagaLoading ? (
                                <>
                                    <Spinner animation="grow" size="sm" /> Confirmer...
                                </>
                            ) : (
                                'Confirmer'
                            )}
                        </Button>
                    </div>
                </OverlayTrigger>
                <Button
                    variant="secondary"
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
