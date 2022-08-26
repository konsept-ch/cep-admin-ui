import { useState } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'
import { Helmet } from 'react-helmet-async'

import { CommonModal } from '../components'
import { addTemplateAction, deleteTemplateAction, updateTemplateAction } from '../actions/templates.ts'
import { getUniqueId, inscriptionStatuses } from '../utils'

export function AttestationTemplatesPage() {
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [isSessionInvitesModalVisible, setIsSessionInvitesModalVisible] = useState(false)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const templates = [
        {
            id: '1',
            title: 'Modèle attestation 1',
            descriptionText: 'Description du modèle attestation 1',
        },
        {
            id: '2',
            title: 'Modèle attestation 2',
            descriptionText: 'Description du modèle attestation 2',
        },
    ]

    const generateNewTemplate = () => ({
        title: 'Nouveau modèle',
        descriptionText: '',
        emailBody: '',
        emailSubject: '',
        smsBody: '',
        statuses: inscriptionStatuses.map((current) => ({ value: current, label: current })),
        id: getUniqueId(),
        isUsedForSessionInvites: false,
    })

    const checkIsTemplateChanged = () => {
        return (
            selectedTemplateData !== null &&
            templates != null &&
            !equals(
                templates.find(({ id }) => id === selectedTemplateData.id),
                selectedTemplateData
            )
        )
    }

    return (
        <>
            <Helmet>
                <title>Modèles Attestations - Former22</title>
            </Helmet>
            <Container fluid className="templates-page">
                <h1>Modèles Attestations</h1>
                <Row>
                    <Col>
                        <ListGroup>
                            {templates.length > 0 &&
                                templates.map(
                                    ({
                                        title,
                                        descriptionText,
                                        emailBody,
                                        statuses,
                                        id,
                                        isUsedForSessionInvites,
                                        emailSubject,
                                        smsBody,
                                    }) => (
                                        <ListGroup.Item
                                            key={id}
                                            onClick={() => {
                                                checkIsTemplateChanged()
                                                    ? setDiscardWarningData({
                                                          isVisible: true,
                                                          selectNewTemplate: () =>
                                                              setSelectedTemplateData({
                                                                  title,
                                                                  descriptionText,
                                                                  emailSubject,
                                                                  smsBody,
                                                                  emailBody,
                                                                  statuses,
                                                                  id,
                                                                  isUsedForSessionInvites,
                                                              }),
                                                      })
                                                    : setSelectedTemplateData({
                                                          title,
                                                          descriptionText,
                                                          emailSubject,
                                                          smsBody,
                                                          emailBody,
                                                          statuses,
                                                          id,
                                                          isUsedForSessionInvites,
                                                      })
                                            }}
                                            className={classNames({
                                                'active-template': selectedTemplateData?.id === id,
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
                                            {descriptionText && <p>{descriptionText}</p>}
                                        </ListGroup.Item>
                                    )
                                )}
                        </ListGroup>
                        <Button
                            variant="success"
                            onClick={() => {
                                if (checkIsTemplateChanged()) {
                                    setDiscardWarningData({
                                        isVisible: true,
                                        selectNewTemplate: () => {
                                            const newTemplateData = generateNewTemplate()

                                            dispatch(addTemplateAction({ templateData: newTemplateData }))
                                            setSelectedTemplateData(newTemplateData)
                                        },
                                    })
                                } else {
                                    const newTemplateData = generateNewTemplate()

                                    dispatch(addTemplateAction({ templateData: newTemplateData }))
                                    setSelectedTemplateData(newTemplateData)
                                }
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
                                        value={selectedTemplateData.descriptionText}
                                        onChange={({ target: { value } }) =>
                                            setSelectedTemplateData({ ...selectedTemplateData, descriptionText: value })
                                        }
                                    />
                                </FloatingLabel>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Fichier Word (.docx):</Form.Label>
                                    <Form.Control type="file" />
                                </Form.Group>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                dispatch(updateTemplateAction({ templateData: selectedTemplateData }))
                                            }}
                                            className="mt-2 me-2"
                                            disabled={!checkIsTemplateChanged()}
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
                                    <CommonModal
                                        title="User autre modèle pour sessions invitées"
                                        content={
                                            <>
                                                <p>Il existe déjà un modèle pour les invitations à une session.</p>
                                                <p>Êtes-vous sûr de vouloir mettre à jour le modèle ?</p>
                                            </>
                                        }
                                        footer={
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
                                                Utiliser
                                            </Button>
                                        }
                                        isVisible={isSessionInvitesModalVisible}
                                        onHide={() => setIsSessionInvitesModalVisible(false)}
                                    />
                                    <CommonModal
                                        title="Avertissement"
                                        content={<p>Êtes-vous sûr de vouloir supprimer ce modèle?</p>}
                                        footer={
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    dispatch(
                                                        deleteTemplateAction({
                                                            id: selectedTemplateData.id,
                                                        })
                                                    )
                                                    setSelectedTemplateData(null)
                                                    setIsDeleteWarningVisible(false)
                                                }}
                                            >
                                                Supprimer
                                            </Button>
                                        }
                                        isVisible={isDeleteWarningVisible}
                                        onHide={() => setIsDeleteWarningVisible(false)}
                                    />
                                    <CommonModal
                                        title="Avertissement"
                                        content={<p>Êtes-vous sûr de vouloir écarter vos modifications ?</p>}
                                        footer={
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => {
                                                        dispatch(
                                                            updateTemplateAction({ templateData: selectedTemplateData })
                                                        )
                                                        discardWarningData.selectNewTemplate()
                                                        setDiscardWarningData({ isVisible: false })
                                                    }}
                                                    className="me-2"
                                                >
                                                    Appliquer
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        discardWarningData.selectNewTemplate()
                                                        setDiscardWarningData({ isVisible: false })
                                                    }}
                                                >
                                                    Écarter modifications
                                                </Button>
                                            </>
                                        }
                                        isVisible={discardWarningData.isVisible}
                                        onHide={() => setDiscardWarningData({ isVisible: false })}
                                    />
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
