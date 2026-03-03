import { useState } from 'react'
import { Form, Modal, Button, ListGroup, Alert, Spinner, Row } from 'react-bootstrap'
import classNames from 'classnames'
import { statusWarnings, formatDate } from '../utils'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'
import { ConfirmInscriptionChangeButton } from '.'
import { useGetMinimumAttestationsQuery } from '../services/attestations'
import { useGetMinimumTemplatesQuery, useLazyGetTemplatePreviewQuery } from '../services/templates'

export const StatusUpdateModal = ({ closeModal, statusUpdateData, updateStatus }) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)
    const [selectedAttestationTemplateUuid, setSelectedAttestationTemplateUuid] = useState(null)
    const [remark, setRemark] = useState(statusUpdateData.remark)

    const { data: attestationTemplates = [], isLoading, isError } = useGetMinimumAttestationsQuery()
    const {
        data: templates = [],
        isLoading: isTemplatesLoading,
        isError: isTemplatesError,
    } = useGetMinimumTemplatesQuery()
    const [refetchPreview, { data: preview = {}, isFetching: isPreviewLoading }] = useLazyGetTemplatePreviewQuery()

    const filteredTemplates = templates.filter((template) =>
        template.statuses.find((status) => status.value === statusUpdateData.newStatus)
    )

    return (
        <Modal show onHide={closeModal} backdrop="static" keyboard={false} dialogClassName="status-change-modal">
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
                        {isTemplatesLoading ? (
                            'Chargement...'
                        ) : isTemplatesError ? (
                            'Erreur de chargement des modèles.'
                        ) : (
                            <ListGroup>
                                <ListGroup.Item
                                    onClick={() => setSelectedTemplateId(null)}
                                    className={classNames({
                                        'active-template': selectedTemplateId === null,
                                    })}
                                >
                                    <h4>Aucun e-mail</h4>
                                    <p>Aucun e-mail ne sera envoyé</p>
                                </ListGroup.Item>
                                {filteredTemplates.map(({ title, descriptionText, templateId }) => (
                                    <ListGroup.Item
                                        key={templateId}
                                        onClick={() => {
                                            refetchPreview({
                                                template: templateId,
                                                session: statusUpdateData.session.id,
                                                inscription: statusUpdateData.id,
                                            }).then(() => setSelectedTemplateId(templateId))
                                        }}
                                        className={classNames({
                                            'active-template': selectedTemplateId === templateId,
                                        })}
                                    >
                                        <h4>{title}</h4>
                                        <p>{descriptionText}</p>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                    <div className="col template-preview">
                        <h6>Aperçu de l'e-mail</h6>
                        {selectedTemplateId !== null ? (
                            <dl>
                                <dt>Sujet de l'email</dt>
                                <dd>
                                    {!isPreviewLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            templateId={selectedTemplateId}
                                            value={preview.emailSubject}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                                <dt>Corps de l'e-mail</dt>
                                <dd>
                                    {!isPreviewLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            templateId={selectedTemplateId}
                                            value={preview.emailContent}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                                <dt>Corps de l'SMS</dt>
                                <dd>
                                    {!isPreviewLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            templateId={selectedTemplateId}
                                            value={preview.smsContent}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                            </dl>
                        ) : (
                            'Aucun e-mail ne sera envoyé'
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
                                            setSelectedAttestationTemplateUuid(null)
                                        }}
                                        className={classNames({
                                            'active-template': selectedAttestationTemplateUuid === null,
                                        })}
                                    >
                                        <h4>Aucune attestation</h4>
                                        <p>Aucun attestation ne sera déposé dans l'espace personnel</p>
                                    </ListGroup.Item>
                                    {attestationTemplates.map(({ title, description, uuid }) => (
                                        <ListGroup.Item
                                            key={uuid}
                                            onClick={() => {
                                                setSelectedAttestationTemplateUuid(uuid)
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
                    isLoading={isTemplatesLoading}
                    variant="primary"
                    onClick={() =>
                        updateStatus({
                            remark,
                            emailTemplateId: selectedTemplateId,
                            shouldSendSms: false,
                            selectedAttestationTemplateUuid,
                        })
                    }
                >
                    Confirmer
                </ConfirmInscriptionChangeButton>
                <ConfirmInscriptionChangeButton
                    isLoading={isTemplatesLoading}
                    variant={statusUpdateData.user.shouldReceiveSms ? 'success' : 'warning'}
                    onClick={() =>
                        updateStatus({
                            remark,
                            emailTemplateId: selectedTemplateId,
                            shouldSendSms: true,
                            selectedAttestationTemplateUuid,
                        })
                    }
                >
                    Confirmer avec SMS
                </ConfirmInscriptionChangeButton>
                <Button variant="outline-primary" onClick={closeModal}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
