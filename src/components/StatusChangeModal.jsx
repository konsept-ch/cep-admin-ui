import { useState } from 'react'
import { Modal, Button, Card, ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { parametersSelector } from '../reducers'

export const StatusChangeModal = ({ closeModal, statusChangeData, updateStatus }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const parameters = useSelector(parametersSelector)

    console.log(statusChangeData)

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
                        <dd>{statusChangeData.date}</dd>
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
                    <dl>
                        <dt>Nouveau statut</dt>
                        <dd>{statusChangeData.newStatus}</dd>
                    </dl>
                    <h6>Choix de template</h6>
                    <Card>
                        {emailTemplates.length > 0 ? (
                            <ListGroup variant="flush">
                                <ListGroup.Item onClick={() => setSelectedTemplate(null)}>
                                    <dl>
                                        <dt>Aucun e-mail</dt>
                                        <dd>Aucun e-mail ne sera envoyé</dd>
                                    </dl>
                                </ListGroup.Item>
                                {emailTemplates.map(({ name, description, template }) => (
                                    <ListGroup.Item onClick={() => setSelectedTemplate(template)}>
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
                    {selectedTemplate ?? 'Aucun e-mail ne sera envoyé'}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        closeModal()
                        updateStatus()
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
