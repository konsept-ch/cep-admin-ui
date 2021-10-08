import { useState } from 'react'
import { Modal, Button, Form, FloatingLabel, Row, Col } from 'react-bootstrap'

export const CourseDetailsModal = ({ closeModal, courseDetailsData }) => {
    const defaultEvent = { type: 'f2f', title: 'test title', description: 'test desc' }
    const [events, setEvents] = useState([defaultEvent])
    const onChangeEventField =
        ({ fieldName, eventOrder }) =>
        ({ target: { value } }) =>
            setEvents((previousEvents) =>
                previousEvents.map((previousEvent, previousEventOrder) =>
                    previousEventOrder === eventOrder ? { ...previousEvent, [fieldName]: value } : previousEvent
                )
            )

    return (
        <Modal show onHide={closeModal} backdrop="static" keyboard={false} dialogClassName="course-details-modal">
            <Modal.Header closeButton>
                <Modal.Title as="h3">Formation : {courseDetailsData.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={4}>
                        <h4>Construction du déroulement</h4>
                        {events.map(({ type, title, description }, eventOrder) => (
                            <Form key={title} className="mb-4">
                                <Row>
                                    <Col sm={2}>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                setEvents((previousEvents) =>
                                                    previousEvents.filter(
                                                        (_, previousEventOrder) => eventOrder !== previousEventOrder
                                                    )
                                                )
                                            }
                                        >
                                            Effacer
                                        </Button>
                                    </Col>
                                    <Col sm={10}>
                                        <FloatingLabel controlId="title" label="Titre" className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Titre de la séance"
                                                value={title}
                                                onChange={onChangeEventField({ fieldName: 'title', eventOrder })}
                                            />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="description" label="Description" className="mb-3">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Description de la séance"
                                                style={{ height: '200px' }}
                                                value={description}
                                                onChange={onChangeEventField({ fieldName: 'description', eventOrder })}
                                            />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="type" label="Type de séance" className="mb-3">
                                            <Form.Select
                                                aria-label="Type de séance"
                                                value={type}
                                                onChange={onChangeEventField({ fieldName: 'type', eventOrder })}
                                            >
                                                <option value="f2f">En salle</option>
                                                <option value="sync">En ligne - Synchronne (en salle virtuelle)</option>
                                                <option value="async">En ligne - Asynchronne (à son rythme)</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Form>
                        ))}
                        <Button
                            variant="primary"
                            onClick={() => setEvents((previousEvents) => [...previousEvents, defaultEvent])}
                        >
                            Ajouter
                        </Button>
                    </Col>
                    <Col sm={8}>
                        <h4>Prévisualisation de la description</h4>
                        {events.map(({ type, title, description }) => (
                            <div>
                                <p>{type}</p>
                                <p>{title}</p>
                                <p>{description}</p>
                            </div>
                        ))}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary">Confirmer</Button>
                <Button variant="secondary" onClick={closeModal}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
