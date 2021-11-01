import { useState, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form } from 'react-bootstrap'
import classNames from 'classnames'

import { templatesSelector } from '../reducers'
import { fetchTemplatesAction, addTemplateAction } from '../actions/templates.ts'
import { getUniqueId } from '../utils'

export const TemplatesPage = memo(() => {
    const fetchedTemplates = useSelector(templatesSelector)
    const [templates, setTemplates] = useState([])
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [isTemplateChanged, setIsTemplateChanged] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTemplatesAction())
    }, [dispatch])

    useEffect(() => {
        setTemplates(fetchedTemplates)
        console.log('fetched templates')
    }, [fetchedTemplates])

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
                                        setSelectedTemplateData({ title, description, body, usages, templateId })
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
                            dispatch(addTemplateAction(generateNewTemplate()))
                            setTemplates([...templates, generateNewTemplate()])
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
                                    onChange={() => setIsTemplateChanged(true)}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="description" label="Description" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description de la séance"
                                    style={{ height: '100px' }}
                                    value={selectedTemplateData.description}
                                    onChange={() => setIsTemplateChanged(true)}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="content" label="Contenu de l'e-mail" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Contenu de l'e-mail"
                                    style={{ height: '200px' }}
                                    value={selectedTemplateData.body}
                                    onChange={() => setIsTemplateChanged(true)}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="usages" label="Utilisation" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Utilisation"
                                    value={selectedTemplateData.usages}
                                    onChange={() => setIsTemplateChanged(true)}
                                />
                            </FloatingLabel>
                            <Button
                                variant="success"
                                onClick={() => {
                                    dispatch(addTemplateAction(generateNewTemplate()))
                                    setTemplates([...templates, generateNewTemplate()])
                                }}
                                className="mt-3"
                                disabled={!isTemplateChanged}
                            >
                                Sauvegarder
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    )
})
