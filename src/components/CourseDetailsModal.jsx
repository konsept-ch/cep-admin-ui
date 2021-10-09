import { useState } from 'react'
import { Modal, Button, Form, FloatingLabel, Row, Col } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUp, faDown } from '@fortawesome/pro-solid-svg-icons'
import { MIDDLEWARE_URL } from '../constants/config'

export const CourseDetailsModal = ({ closeModal, courseDetailsData }) => {
    const generateDefaultEvent = () => ({ id: uuidv4(), type: 'f2f', title: '', description: '' })
    const [events, setEvents] = useState([generateDefaultEvent()])
    const onChangeEventField =
        ({ fieldName, id }) =>
        ({ target: { value } }) =>
            setEvents((previousEvents) =>
                previousEvents.map((previousEvent) =>
                    previousEvent.id === id ? { ...previousEvent, [fieldName]: value } : previousEvent
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
                        {events.map(({ id, type, title, description }, eventOrder) => (
                            <Form key={id} className="mb-4">
                                <Row>
                                    <Col sm={2}>
                                        <Button
                                            className="d-block mb-3"
                                            variant="danger"
                                            onClick={() =>
                                                setEvents((previousEvents) =>
                                                    previousEvents.filter(({ id: previousId }) => previousId !== id)
                                                )
                                            }
                                        >
                                            Effacer
                                        </Button>
                                        {events.length > 1 && (
                                            <>
                                                {eventOrder !== 0 && (
                                                    <Button
                                                        className="d-block mb-1"
                                                        variant="primary"
                                                        onClick={() =>
                                                            setEvents((previousEvents) => {
                                                                const copyOfPreviousEvents = [...previousEvents]
                                                                const from = eventOrder
                                                                const to = eventOrder - 1
                                                                const on = 1

                                                                copyOfPreviousEvents.splice(
                                                                    to,
                                                                    0,
                                                                    ...copyOfPreviousEvents.splice(from, on)
                                                                )

                                                                return copyOfPreviousEvents
                                                            })
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faUp} />
                                                    </Button>
                                                )}
                                                {eventOrder !== events.length - 1 && (
                                                    <Button
                                                        className="d-block"
                                                        variant="primary"
                                                        onClick={() =>
                                                            setEvents((previousEvents) => {
                                                                const copyOfPreviousEvents = [...previousEvents]
                                                                const from = eventOrder
                                                                const to = eventOrder + 1
                                                                const on = 1

                                                                copyOfPreviousEvents.splice(
                                                                    to,
                                                                    0,
                                                                    ...copyOfPreviousEvents.splice(from, on)
                                                                )

                                                                return copyOfPreviousEvents
                                                            })
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faDown} />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </Col>
                                    <Col sm={10}>
                                        <FloatingLabel controlId="title" label="Titre" className="mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Titre de la séance"
                                                value={title}
                                                onChange={onChangeEventField({ fieldName: 'title', id })}
                                            />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="description" label="Description" className="mb-2">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Description de la séance"
                                                style={{ height: '100px' }}
                                                value={description}
                                                onChange={onChangeEventField({ fieldName: 'description', id })}
                                            />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="type" label="Type de séance" className="mb-2">
                                            <Form.Select
                                                aria-label="Type de séance"
                                                value={type}
                                                onChange={onChangeEventField({ fieldName: 'type', id })}
                                            >
                                                <option value="f2f">En salle</option>
                                                <option value="sync">En ligne - Synchronne (en salle virtuelle)</option>
                                                <option value="async">En ligne - Asynchronne (à son rythme)</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <hr />
                            </Form>
                        ))}
                        <Button
                            variant="success"
                            onClick={() => setEvents((previousEvents) => [...previousEvents, generateDefaultEvent()])}
                        >
                            Ajouter
                        </Button>
                    </Col>
                    <Col sm={8}>
                        <h4>Prévisualisation de la description</h4>
                        {events.map(({ type, title, description }) => (
                            <div>
                                <hr />
                                {type === 'f2f' && <h5>{title}</h5>}
                                {type === 'sync' && <h6>{title}</h6>}
                                {type === 'async' && <h4>{title}</h4>}
                                <p>{description}</p>
                            </div>
                        ))}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={async () => {
                        const courseData = await fetch(`${MIDDLEWARE_URL}/courseBySlug/${courseDetailsData.slug}`)
                        const courseJson = await courseData.json()

                        const splitComment = '<!-- AUTO -->'

                        const mapEventTypeToClassName = ({ type }) =>
                            ({
                                f2f: 'presence-course',
                                sync: 'online-sync',
                                async: 'online-async',
                            }[type])

                        const programText = `${splitComment}
                        <!-- START Resume section-->
                        <div class="course-resume">
                          <div class="info-holder">
                            <h3>résumé</h3>
                            <h4>durée totale</h4>
                            <h5>${events.length} jours</h5>
                            <h6>dont</h6>
                            <div class="course-durations">
                              <div class="duration-holder">
                                <p class="dur-first-label">Présentiel:&nbsp;</p>
                                <p class="dur-info">${
                                    events.filter(({ type }) => type === 'f2f').length
                                } jours &nbsp;</p>
                              </div>
                              <div class="duration-holder">
                                <p class="dur-label">Synchrone:&nbsp;</p>
                                <p class="dur-info">${
                                    events.filter(({ type }) => type === 'f2f').length
                                } jours &nbsp;</p>
                              </div>
                              <div class="duration-holder">
                                <p class="dur-label">Asynchrone:&nbsp;</p>
                                <p class="dur-info">${
                                    events.filter(({ type }) => type === 'f2f').length
                                } jours &nbsp;</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- END Resume section-->
                        <div class="course-type">
                          <h3>En salle</h3>
                          <h3>En ligne</h3>
                        </div>
                        <div class="courses-list">
                            ${events
                                .map(
                                    ({ type, title, description }, eventOrder) =>
                                        `<div class="${mapEventTypeToClassName({ type })}">
                                      <div class="day-counter">jour ${eventOrder + 1}/${events.length}</div>
                                      <div class="content-holder">
                                        <div class="heading-holder">
                                          <h2>${title}</h2>
                                        </div>
                                        <div class="description-holder">
                                          <h3>Description</h3>
                                          <p>${description}</p>
                                        </div>
                                      </div>
                                    </div>`
                                )
                                .join('')}
                        </div>`

                        const savedCourseResponse = await fetch(
                            `${MIDDLEWARE_URL}/saveCourseById/${courseDetailsData.id}`,
                            {
                                method: 'put',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({
                                    ...courseJson,
                                    description: `${courseJson.description.split(splitComment)[0]}${programText}`,
                                }),
                            }
                        )
                        console.log(savedCourseResponse)
                    }}
                >
                    Confirmer
                </Button>
                <Button variant="secondary" onClick={closeModal}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
