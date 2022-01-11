import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'
import { templatesSelector, templateForInvitesSelector } from '../reducers'
import { CommonModal } from '../components'
import {
    fetchTemplatesAction,
    addTemplateAction,
    deleteTemplateAction,
    updateTemplateAction,
} from '../actions/templates.ts'
import { getUniqueId, inscriptionStatuses } from '../utils'
import { EmailTemplateBodyInput } from '../components/EmailTemplateBodyInput'
import { Helmet } from 'react-helmet-async'

export function TemplatesPage() {
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [isSessionInvitesModalVisible, setIsSessionInvitesModalVisible] = useState(false)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })
    const templates = useSelector(templatesSelector)
    const templateForInvites = useSelector(templateForInvitesSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTemplatesAction())
    }, [])

    const generateNewTemplate = () => ({
        title: 'Nouveau modèle',
        description: '',
        body: '',
        emailSubject: '',
        smsBody: '',
        statuses: inscriptionStatuses.map((current) => ({ value: current, label: current })),
        templateId: getUniqueId(),
        isUsedForSessionInvites: false,
    })

    const checkIsTemplateChanged = () => {
        return (
            selectedTemplateData !== null &&
            !equals(
                templates.find(({ templateId }) => templateId === selectedTemplateData.templateId),
                selectedTemplateData
            )
        )
    }

    return (
        <>
            <Helmet>
                <title>Modèles - Former22</title>
            </Helmet>
            <Container fluid className="templates-page">
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
                                        smsBody,
                                    }) => (
                                        <ListGroup.Item
                                            key={templateId}
                                            onClick={() => {
                                                checkIsTemplateChanged()
                                                    ? setDiscardWarningData({
                                                          isVisible: true,
                                                          selectNewTemplate: () =>
                                                              setSelectedTemplateData({
                                                                  title,
                                                                  description,
                                                                  emailSubject,
                                                                  smsBody,
                                                                  body,
                                                                  statuses,
                                                                  templateId,
                                                                  isUsedForSessionInvites,
                                                              }),
                                                      })
                                                    : setSelectedTemplateData({
                                                          title,
                                                          description,
                                                          emailSubject,
                                                          smsBody,
                                                          body,
                                                          statuses,
                                                          templateId,
                                                          isUsedForSessionInvites,
                                                      })
                                            }}
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
                                        value={selectedTemplateData.description}
                                        onChange={({ target: { value } }) =>
                                            setSelectedTemplateData({ ...selectedTemplateData, description: value })
                                        }
                                    />
                                </FloatingLabel>
                                <label>Sujet de l'email :</label>
                                <EmailTemplateBodyInput
                                    className="email-subject-input"
                                    onChange={(value) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, emailSubject: value })
                                    }
                                    value={{
                                        value: selectedTemplateData.emailSubject,
                                        templateId: selectedTemplateData.templateId,
                                    }}
                                    shouldHaveVariables
                                    isEmailSubjectInput
                                />
                                <label>Corps de le SMS :</label>
                                <EmailTemplateBodyInput
                                    className="email-body-input"
                                    onChange={(value) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, smsBody: value })
                                    }
                                    value={{
                                        value: selectedTemplateData.smsBody,
                                        templateId: selectedTemplateData.templateId,
                                    }}
                                    shouldHaveVariables
                                />
                                <label>Corps de l'e-mail :</label>
                                <EmailTemplateBodyInput
                                    className="email-body-input"
                                    onChange={(value) =>
                                        setSelectedTemplateData({ ...selectedTemplateData, body: value })
                                    }
                                    value={{
                                        value: selectedTemplateData.body,
                                        templateId: selectedTemplateData.templateId,
                                    }}
                                    shouldHandleKeyCommand
                                    shouldHaveVariables
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
                                                            templateId: selectedTemplateData.templateId,
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
