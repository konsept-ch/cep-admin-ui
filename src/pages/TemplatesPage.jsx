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
    const [isModalVisible, setIsModalVisible] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTemplatesAction())
    }, [])

    const generateNewTemplate = () => ({
        title: 'Nouveau modèle',
        description: '',
        body: '',
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
                                ({ title, description, body, statuses, templateId, isUsedForSessionInvites }) => (
                                    <ListGroup.Item
                                        key={templateId}
                                        onClick={() =>
                                            setSelectedTemplateData({
                                                title,
                                                description,
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
                                            <h4 className="d-inline-block me-2">{title}</h4>
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
                        className="mt-3"
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
                            <label>Contenu de l'e-mail :</label>
                            <EmailTemplateBodyInput
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
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            dispatch(updateTemplateAction({ templateData: selectedTemplateData }))
                                        }}
                                        className="mt-2 me-3"
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
                                        onClick={() => {
                                            dispatch(
                                                deleteTemplateAction({ templateId: selectedTemplateData.templateId })
                                            )
                                            setSelectedTemplateData(null)
                                        }}
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
                                                setIsModalVisible(true)
                                            } else {
                                                dispatch(
                                                    updateTemplateAction({
                                                        templateData: {
                                                            ...selectedTemplateData,
                                                            isUsedForSessionInvites: true,
                                                        },
                                                    })
                                                )
                                            }
                                        }}
                                        className="mt-2"
                                    >
                                        Utiliser pour sessions invitées
                                    </Button>
                                )}
                                <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)}>
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
                                            variant="primary"
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
                                                setIsModalVisible(false)
                                            }}
                                        >
                                            Appliquer
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
