import { useState } from 'react'
import { Modal, Button, Card, ListGroup, Alert, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { parametersSelector, loadingSelector } from '../reducers'

export const StatusChangeModal = ({ closeModal, statusChangeData, updateStatus }) => {
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const parameters = useSelector(parametersSelector)
    const isSagaLoading = useSelector(loadingSelector)

    const emailTemplates = parameters.emailTemplates[statusChangeData.newStatus]

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
                <div className="col">
                    <h6>Détails de l'inscription</h6>
                    <dl>
                        <dt>Date d'inscription</dt>
                        <dd>{statusChangeData.date}</dd>
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
                        <dd>{statusChangeData.session.restrictions.dates}</dd>
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
                    <h6>Choix de template</h6>
                    <Card>
                        {emailTemplates.length > 0 ? (
                            <ListGroup variant="flush">
                                <ListGroup.Item onClick={() => setSelectedTemplateData(null)}>
                                    <dl>
                                        <dt>Aucun e-mail</dt>
                                        <dd>Aucun e-mail ne sera envoyé</dd>
                                    </dl>
                                </ListGroup.Item>
                                {emailTemplates.map(({ name, description, template }) => (
                                    <ListGroup.Item onClick={() => setSelectedTemplateData({ template, name })}>
                                        <dl>
                                            <dt>Nom</dt>
                                            <dd>{name}</dd>
                                            <dt>Description</dt>
                                            <dd>{description}</dd>
                                        </dl>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : null}
                    </Card>
                </div>
                <div className="col template-preview">
                    <h6>Aperçu de l'e-mail</h6>
                    {selectedTemplateData !== null ? selectedTemplateData.template : 'Aucun e-mail ne sera envoyé'}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        updateStatus({ emailTemplateName: selectedTemplateData?.name })
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
