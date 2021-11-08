import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'
import { templatesSelector } from '../reducers'
import {
    fetchTemplatesAction,
    addTemplateAction,
    deleteTemplateAction,
    updateTemplateAction,
} from '../actions/templates.ts'
import { getUniqueId, inscriptionStatuses } from '../utils'

export function TemplatesPage() {
    const templates = useSelector(templatesSelector)
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
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
                                                    Session invitèe
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
                            <FloatingLabel controlId="content" label="Contenu de l'e-mail" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Contenu de l'e-mail"
                                    style={{ height: '200px' }}
                                    value={selectedTemplateData.body}
                                    onChange={({ target: { value } }) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, body: value })
                                    }
                                />
                            </FloatingLabel>
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
                                    <p className="mt-3">Utiliser pour sessions invitèes</p>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
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
                                        }}
                                        className="mt-2"
                                    >
                                        Utiliser pour sessions invitèes
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
