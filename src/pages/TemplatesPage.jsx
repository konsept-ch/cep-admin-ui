import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge, Modal } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'
import { templatesSelector, templateForInvitesSelector } from '../reducers'
import {
    fetchTemplatesAction,
    addTemplateAction,
    deleteTemplateAction,
    updateTemplateAction,
} from '../actions/templates.ts'
import { getUniqueId, inscriptionStatuses } from '../utils'
import { EmailTemplateBodyInput } from '../components/EmailTemplateBodyInput'

export function TemplatesPage() {
    const templates = useSelector(templatesSelector)
    const templateForInvites = useSelector(templateForInvitesSelector)
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [isSessionInvitesModalVisible, setIsSessionInvitesModalVisible] = useState(false)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTemplatesAction())
    }, [])

    const generateNewTemplate = () => ({
        title: 'Nouveau modèle',
        description: '',
        body: '',
        emailSubject: '',
        statuses: inscriptionStatuses.map((current) => ({ value: current, label: current })),
        templateId: getUniqueId(),
        isUsedForSessionInvites: false,
    })

    return (
        <Container fluid className="templatesPage">
            <h1>Modèles</h1>
            <Row>
                <Col>
                    <ListGroup>
                        {templates.length > 0 &&
                            templates.map(
                                ({
                                    title,
                                    description,
                                    body,
                                    statuses,
                                    templateId,
                                    isUsedForSessionInvites,
                                    emailSubject,
                                }) => (
                                    <ListGroup.Item
                                        key={templateId}
                                        onClick={() =>
                                            setSelectedTemplateData({
                                                title,
                                                description,
                                                emailSubject,
                                                body,
                                                statuses,
                                                templateId,
                                                isUsedForSessionInvites,
                                            })
                                        }
                                        className={classNames({
                                            'active-template': selectedTemplateData?.templateId === templateId,
                                        })}
                                    >
                                        <div className="d-flex align-items-start justify-content-between">
                                            <h4 className="d-inline-block">{title}</h4>
                                            {isUsedForSessionInvites && (
                                                <Badge bg="warning" text="dark">
                                                    Sessions invitées
                                                </Badge>
                                            )}
                                        </div>
                                        {description && <p>{description}</p>}
                                    </ListGroup.Item>
                                )
                            )}
                    </ListGroup>
                    <Button
                        variant="success"
                        onClick={() => {
                            const newTemplateData = generateNewTemplate()

                            dispatch(addTemplateAction({ templateData: newTemplateData }))
                            setSelectedTemplateData(newTemplateData)
                        }}
                        className="mt-2"
                    >
                        Ajouter
                    </Button>
                </Col>
                <Col className="template-preview">
                    {selectedTemplateData && (
                        <>
                            <FloatingLabel controlId="title" label="Titre" className="mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Titre de la séance"
                                    value={selectedTemplateData.title}
                                    onChange={({ target: { value } }) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, title: value })
                                    }
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="description" label="Description" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description de la séance"
                                    style={{ height: '100px' }}
                                    value={selectedTemplateData.description}
                                    onChange={({ target: { value } }) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, description: value })
                                    }
                                />
                            </FloatingLabel>
                            <label>Sujet de l'email :</label>
                            <EmailTemplateBodyInput
                                className="emailSubjectInput"
                                onChange={(value) =>
                                    setSelectedTemplateData({ ...selectedTemplateData, emailSubject: value })
                                }
                                value={{
                                    value: selectedTemplateData.emailSubject,
                                    templateId: selectedTemplateData.templateId,
                                }}
                            />
                            <label>Contenu de l'e-mail :</label>
                            <EmailTemplateBodyInput
                                className="emailBodyInput"
                                onChange={(value) => setSelectedTemplateData({ ...selectedTemplateData, body: value })}
                                value={{
                                    value: selectedTemplateData.body,
                                    templateId: selectedTemplateData.templateId,
                                }}
                            />
                            <label>Valable pour statuts :</label>
                            <Select
                                onChange={(selectedStatuses) =>
                                    setSelectedTemplateData({ ...selectedTemplateData, statuses: selectedStatuses })
                                }
                                value={selectedTemplateData.statuses}
                                closeMenuOnSelect={false}
                                isMulti
                                options={inscriptionStatuses.map((current) => ({ value: current, label: current }))}
                            />
                            <div className="d-flex justify-content-between mb-2">
                                <div>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            dispatch(updateTemplateAction({ templateData: selectedTemplateData }))
                                        }}
                                        className="mt-2 me-2"
                                        disabled={equals(
                                            templates.find(
                                                ({ templateId }) => templateId === selectedTemplateData.templateId
                                            ),
                                            selectedTemplateData
                                        )}
                                    >
                                        Appliquer
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => setIsDeleteWarningVisible(true)}
                                        className="mt-2"
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                                {selectedTemplateData.isUsedForSessionInvites ? (
                                    <p className="mt-3">Utilisé pour sessions invitées</p>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            if (templateForInvites) {
                                                setIsSessionInvitesModalVisible(true)
                                            } else {
                                                dispatch(
                                                    updateTemplateAction({
                                                        templateData: {
                                                            ...selectedTemplateData,
                                                            isUsedForSessionInvites: true,
                                                        },
                                                    })
                                                )
                                                setSelectedTemplateData({
                                                    ...selectedTemplateData,
                                                    isUsedForSessionInvites: true,
                                                })
                                            }
                                        }}
                                        className="mt-2"
                                    >
                                        Utiliser pour sessions invitées
                                    </Button>
                                )}
                                <Modal
                                    show={isSessionInvitesModalVisible}
                                    onHide={() => setIsSessionInvitesModalVisible(false)}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>User autre modèle pour sessions invitées</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <>
                                            <p>Il existe déjà un modèle pour les invitations à une session.</p>
                                            <p>Êtes-vous sûr de vouloir mettre à jour le modèle ?</p>
                                        </>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                dispatch(
                                                    updateTemplateAction({
                                                        templateData: {
                                                            ...templateForInvites,
                                                            isUsedForSessionInvites: false,
                                                        },
                                                    })
                                                )
                                                dispatch(
                                                    updateTemplateAction({
                                                        templateData: {
                                                            ...selectedTemplateData,
                                                            isUsedForSessionInvites: true,
                                                        },
                                                    })
                                                )
                                                setSelectedTemplateData({
                                                    ...selectedTemplateData,
                                                    isUsedForSessionInvites: true,
                                                })
                                                setIsSessionInvitesModalVisible(false)
                                            }}
                                        >
                                            Valider
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={isDeleteWarningVisible} onHide={() => setIsDeleteWarningVisible(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Avertissement</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>Êtes-vous sûr de vouloir supprimer ce modèle?</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                dispatch(
                                                    deleteTemplateAction({
                                                        templateId: selectedTemplateData.templateId,
                                                    })
                                                )
                                                setSelectedTemplateData(null)
                                                setIsDeleteWarningVisible(false)
                                            }}
                                        >
                                            Valider
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
