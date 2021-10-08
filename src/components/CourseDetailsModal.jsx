import { useState } from 'react'
import { Modal, Button, Form, FloatingLabel, Row, Col } from 'react-bootstrap'

export const CourseDetailsModal = ({ closeModal, courseDetailsData }) => {
    const [eventFields, setEventFields] = useState({ type: 'f2f', title: 'test title', description: 'test desc' })

    const onChangeEventField =
        ({ fieldId }) =>
        ({ target: { value } }) =>
            setEventFields((fields) => ({ ...fields, [fieldId]: value }))

    return (
        <Modal show onHide={closeModal} backdrop="static" keyboard={false} dialogClassName="course-details-modal">
            <Modal.Header closeButton>
                <Modal.Title as="h3">Formation : {courseDetailsData.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={4}>
                        <h4>Construction du déroulement</h4>
                        <Form>
                            <FloatingLabel controlId="type" label="Type de séance">
                                <Form.Select
                                    aria-label="Type de séance"
                                    onChange={onChangeEventField({ fieldId: 'type' })}
                                >
                                    <option value="f2f">En salle</option>
                                    <option value="sync">En ligne - Synchronne (en salle virtuelle)</option>
                                    <option value="async">En ligne - Asynchronne (à son rythme)</option>
                                </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="title" label="Titre">
                                <Form.Control
                                    type="text"
                                    placeholder="Titre de la séance"
                                    onChange={onChangeEventField({ fieldId: 'title' })}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="description" label="Description">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description de la séance"
                                    style={{ height: '200px' }}
                                    onChange={onChangeEventField({ fieldId: 'description' })}
                                />
                            </FloatingLabel>
                        </Form>
                    </Col>
                    <Col sm={8}>
                        <h4>Prévisualisation de la description</h4>
                        <p>{eventFields.type}</p>
                        <p>{eventFields.title}</p>
                        <p>{eventFields.description}</p>
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
