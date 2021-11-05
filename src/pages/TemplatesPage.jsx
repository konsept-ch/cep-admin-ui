import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'

import { templatesSelector } from '../reducers'
import {
    fetchTemplatesAction,
    addTemplateAction,
    deleteTemplateAction,
    updateTemplateAction,
} from '../actions/templates.ts'
import { getUniqueId } from '../utils'

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
        usages: [],
        templateId: getUniqueId(),
    })

    return (
        <Container fluid className="templatesPage">
            <h1>Modèles</h1>
            <Row>
                <Col>
                    <ListGroup>
                        {templates.length > 0 &&
                            templates.map(({ title, description, body, usages, templateId }) => (
                                <ListGroup.Item
                                    key={templateId}
                                    onClick={() =>
                                        setSelectedTemplateData({
                                            title,
                                            description,
                                            body,
                                            usages,
                                            templateId,
                                        })
                                    }
                                    className={classNames({
                                        'active-template': selectedTemplateData?.templateId === templateId,
                                    })}
                                >
                                    <h4>{title}</h4>
                                    <p>{description}</p>
                                </ListGroup.Item>
                            ))}
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
                            <FloatingLabel controlId="usages" label="Utilisation" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Utilisation"
                                    value={selectedTemplateData.usages}
                                    onChange={({ target: { value } }) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, usages: value })
                                    }
                                />
                            </FloatingLabel>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    dispatch(updateTemplateAction({ templateData: selectedTemplateData }))
                                }}
                                className="mt-2 me-3"
                                disabled={equals(
                                    templates.find(({ templateId }) => templateId === selectedTemplateData.templateId),
                                    selectedTemplateData
                                )}
                            >
                                Appliquer
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    dispatch(deleteTemplateAction({ templateId: selectedTemplateData.templateId }))
                                    setSelectedTemplateData(null)
                                }}
                                className="mt-2"
                            >
                                Supprimer
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
