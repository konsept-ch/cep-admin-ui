import { useState } from 'react'
import { Modal, Button, Form, FloatingLabel, Row, Col } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { mapClassNameToEventType, mapEventTypeToClassName, callApi } from '../utils'
import { splitComment } from '../constants/constants'
// import { RichEditor } from './RichEditor'
import { toast } from 'react-toastify'

export const CourseDetailsModal = ({ closeModal, courseDetailsData = {}, onAfterSave }) => {
    const generateDefaultEvent = () => ({ id: uuidv4(), type: 'f2f', title: '', description: '' })
    const parser = new DOMParser()
    const doc = parser.parseFromString(courseDetailsData.description, 'text/html')

    const existingHtmlNodes = doc.querySelectorAll('.courses-list > div')

    const existing = Array.from(existingHtmlNodes).map((courseItemNode) => ({
        id: uuidv4(),
        type: mapClassNameToEventType({ className: courseItemNode.className }),
        title: courseItemNode.querySelector('h2').innerText,
        description: courseItemNode.querySelector('p').innerText,
    }))
    const [events, setEvents] = useState(existing)

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
                {/* <Row>
                    <Col>
                        {courseDetailsData.description?.split(splitComment)[0] && (
                            <RichEditor initialText={courseDetailsData.description?.split(splitComment)[0]} />
                        )}
                    </Col>
                </Row> */}
                <Row>
                    <Col sm={4}>
                        <h4>Construction du déroulement</h4>
                        {events.map(({ id, type, title, description }, eventOrder) => (
                            <Form key={id} className="mb-4">
                                <Row>
                                    <Col sm={3}>
                                        <p>
                                            Étape {eventOrder + 1}/{events.length}
                                        </p>
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
                                                        <FontAwesomeIcon icon={faAngleUp} />
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
                                                        <FontAwesomeIcon icon={faAngleDown} />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                        <Button
                                            className="d-block mt-3"
                                            variant="danger"
                                            onClick={() =>
                                                setEvents((previousEvents) =>
                                                    previousEvents.filter(({ id: previousId }) => previousId !== id)
                                                )
                                            }
                                        >
                                            Supprimer
                                        </Button>
                                    </Col>
                                    <Col sm={9}>
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
                                                <option value="sync">À distance (ensemble) (en salle virtuelle)</option>
                                                <option value="async">À distance (individuel) (à son rythme)</option>
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
                        <h5>Déroulement</h5>
                        <div className="course-resume">
                            <div className="info-holder">
                                <h4>durée totale</h4>
                                <h5>{events.length} étapes</h5>
                                <h6>dont</h6>
                                <div className="course-durations">
                                    <div className="duration-holder">
                                        <p className="dur-first-label">En salle:&nbsp;</p>
                                        <p className="dur-info">
                                            {events.filter(({ type }) => type === 'f2f').length} étape(s) &nbsp;
                                        </p>
                                    </div>
                                    <div className="duration-holder">
                                        <p className="dur-label">À distance (ensemble):&nbsp;</p>
                                        <p className="dur-info">
                                            {events.filter(({ type }) => type === 'sync').length} étape(s) &nbsp;
                                        </p>
                                    </div>
                                    <div className="duration-holder">
                                        <p className="dur-label">À distance (individuel):&nbsp;</p>
                                        <p className="dur-info">
                                            {events.filter(({ type }) => type === 'async').length} étape(s) &nbsp;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="course-type">
                            <h3>En salle</h3>
                            <h3>À distance</h3>
                        </div>
                        <div className="courses-list">
                            {events.map(({ type, title, description }, eventOrder) => (
                                <div className={mapEventTypeToClassName({ type })}>
                                    <div className="day-counter">
                                        étape {eventOrder + 1}/{events.length}
                                    </div>
                                    <div className="content-holder">
                                        <div className="heading-holder">
                                            <h2>{title}</h2>
                                        </div>
                                        <div className="description-holder">
                                            <h3>Description</h3>
                                            <p>{description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={async () => {
                        const courseData = await callApi({ path: `courses/by-slug/${courseDetailsData.slug}` })

                        if (courseData.description !== courseDetailsData.description) {
                            toast.error(
                                'Erreur ! Des modifications sur la même formation ont été faites directement dans Claroline, vous devriez refaire vos modifications, veuillez rafraîchir la page (bouton F5) avant de continuer.',
                                { position: 'top-right', autoClose: false }
                            )
                            closeModal()
                            return
                        } else {
                            const programText = `${splitComment}
                            <!-- START Resume section-->
                            <h5>Déroulement</h5>
                            <div class="course-resume">
                              <div class="info-holder">
                                <h4>durée totale</h4>
                                <h5>${events.length} étapes</h5>
                                <h6>dont</h6>
                                <div class="course-durations">
                                  <div class="duration-holder">
                                    <p class="dur-first-label">En salle:&nbsp;</p>
                                    <p class="dur-info">${
                                        events.filter(({ type }) => type === 'f2f').length
                                    } étapes &nbsp;</p>
                                  </div>
                                  <div class="duration-holder">
                                    <p class="dur-label">À distance (ensemble):&nbsp;</p>
                                    <p class="dur-info">${
                                        events.filter(({ type }) => type === 'sync').length
                                    } étapes &nbsp;</p>
                                  </div>
                                  <div class="duration-holder">
                                    <p class="dur-label">À distance (individuel):&nbsp;</p>
                                    <p class="dur-info">${
                                        events.filter(({ type }) => type === 'async').length
                                    } étapes &nbsp;</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- END Resume section-->
                            <div class="course-type">
                              <h3>En salle</h3>
                              <h3>À distance</h3>
                            </div>
                            <div class="courses-list">
                                ${events
                                    .map(
                                        ({ type, title, description }, eventOrder) =>
                                            `<div class="${mapEventTypeToClassName({ type })}">
                                          <div class="day-counter">étape ${eventOrder + 1}/${events.length}</div>
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

                            const savedCourseResponse = await callApi({
                                path: `courses/save-by-id/${courseDetailsData.id}`,
                                method: 'put',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({
                                    ...courseData,
                                    description: `${courseData.description.split(splitComment)[0]}${programText}`,
                                }),
                                successCallback: () => toast.success('Succès !'),
                            })

                            // eslint-disable-next-line no-console
                            console.log(savedCourseResponse)
                        }

                        onAfterSave()
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
