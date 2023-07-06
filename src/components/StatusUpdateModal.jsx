import { useState, useEffect } from 'react'
import { Form, Modal, Button, ListGroup, Alert, Spinner, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { fetchParametersAction } from '../actions/parameters.ts'
import { fetchTemplatePreviewsAction } from '../actions/templates.ts'
import { parametersSelector, loadingSelector, templatePreviewsSelector, templatesLoadingSelector } from '../reducers'
import { statusWarnings, formatDate } from '../utils'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'
import { ConfirmInscriptionChangeButton } from '.'
import { useGetAttestationsQuery } from '../services/attestations'

export const StatusUpdateModal = ({ closeModal, statusUpdateData, updateStatus }) => {
    const {
        data: attestationTemplates,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetAttestationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [selectedAttestationTemplateUuid, setSelectedAttestationTemplateUuid] = useState(null)
    const [remark, setRemark] = useState(statusUpdateData.remark)
    const parameters = useSelector(parametersSelector)
    const isSagaLoading = useSelector(loadingSelector)
    const areTemplatesLoading = useSelector(templatesLoadingSelector)
    const templatePreviews = useSelector(templatePreviewsSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchParametersAction())
    }, [dispatch])

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

    // const attestationTemplates = [
    //     {
    //         templateId: '1',
    //         title: 'Modèle attestation 1',
    //         description: 'Description du modèle attestation 1',
    //     },
    //     {
    //         templateId: '2',
    //         title: 'Modèle attestation 2',
    //         description: 'Description du modèle attestation 2',
    //     },
    // ]

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
            <Modal.Body>
                <Row>
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
                            <dd>{`${statusUpdateData.user.lastName} ${statusUpdateData.user.firstName}`}</dd>
                            <dt>E-mail du participant</dt>
                            <dd>
                                <a href={`mailto:${statusUpdateData.user.email}`}>{statusUpdateData.user.email}</a>
                            </dd>
                            <dt>Fonction professionnelle</dt>
                            <dd>{statusUpdateData.user.profession ?? '(Aucune profession choisie)'}</dd>
                            <dt>Numéro de téléphone du participant</dt>
                            <dd>
                                {statusUpdateData.user.phone ? (
                                    <>
                                        {statusUpdateData.user.phone}
                                        <br />
                                        <a href={`tel:${statusUpdateData.user.phoneForSms}`}>
                                            <i>({statusUpdateData.user.phoneForSms})</i>
                                        </a>
                                    </>
                                ) : (
                                    '(Aucun numéro saisi)'
                                )}
                            </dd>
                            <dt>Recevoir SMS ?</dt>
                            <dd>{statusUpdateData.user.shouldReceiveSms ? 'Oui' : 'Non'}</dd>
                        </dl>
                        <hr />
                        <dl>
                            <dt>Nom de la session</dt>
                            <dd>{statusUpdateData.session.name}</dd>
                            <dt>Date de début</dt>
                            <dd>
                                {formatDate({ dateString: statusUpdateData.session.startDate, isDateVisible: true })}
                            </dd>
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
                        <h6>Remarque</h6>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                defaultValue={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </Form.Group>
                        <h6>Choix de modèle d'e-mail</h6>
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
                                emailTemplates.map(({ title, description, emailBody, templateId, emailSubject }) => (
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
                </Row>
                {(statusUpdateData.newStatus === 'Participation' || statusUpdateData.isCreatingAttestation) &&
                    (isLoading ? (
                        'Chargement...'
                    ) : isError ? (
                        'Erreur de chargement des modèles.'
                    ) : (
                        <Row>
                            <div className="col-sm-4">
                                <h6>Choix de modèle d'attestation</h6>
                                <ListGroup>
                                    <ListGroup.Item
                                        onClick={() => {
                                            setSelectedAttestationTemplateUuid('no-attestation')
                                        }}
                                        className={classNames({
                                            'active-template': selectedAttestationTemplateUuid === 'no-attestation',
                                        })}
                                    >
                                        <h4>Aucune attestation</h4>
                                        <p>Aucun attestation ne sera déposé dans l'espace personnel</p>
                                    </ListGroup.Item>
                                    {attestationTemplates.length > 0 &&
                                        attestationTemplates.map(({ title, description, uuid }) => (
                                            <ListGroup.Item
                                                key={uuid}
                                                onClick={() => {
                                                    setSelectedAttestationTemplateUuid(uuid)
                                                    // fetchTemplatePreviews({ uuid })
                                                }}
                                                className={classNames({
                                                    'active-template': selectedAttestationTemplateUuid === uuid,
                                                })}
                                            >
                                                <h4>{title}</h4>
                                                <p>{description}</p>
                                            </ListGroup.Item>
                                        ))}
                                </ListGroup>
                            </div>
                        </Row>
                    ))}
            </Modal.Body>
            <Modal.Footer>
                <ConfirmInscriptionChangeButton
                    isSelectedTemplateDataNull={selectedTemplateData === null}
                    isLoading={isSagaLoading}
                    variant="primary"
                    onClick={() => {
                        const templateId =
                            selectedTemplateData?.templateId === 'no-email' ? null : selectedTemplateData.templateId

                        updateStatus({
                            remark,
                            emailTemplateId: templateId,
                            shouldSendSms: false,
                            selectedAttestationTemplateUuid:
                                selectedAttestationTemplateUuid === 'no-attestation'
                                    ? null
                                    : selectedAttestationTemplateUuid,
                        })
                    }}
                >
                    Confirmer
                </ConfirmInscriptionChangeButton>
                <ConfirmInscriptionChangeButton
                    isSelectedTemplateDataNull={selectedTemplateData === null}
                    isLoading={isSagaLoading}
                    variant={statusUpdateData.user.shouldReceiveSms ? 'success' : 'warning'}
                    onClick={() => {
                        const templateId =
                            selectedTemplateData?.templateId === 'no-email' ? null : selectedTemplateData.templateId

                        updateStatus({
                            remark,
                            emailTemplateId: templateId,
                            shouldSendSms: true,
                            selectedAttestationTemplateUuid:
                                selectedAttestationTemplateUuid === 'no-attestation'
                                    ? null
                                    : selectedAttestationTemplateUuid,
                        })
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
