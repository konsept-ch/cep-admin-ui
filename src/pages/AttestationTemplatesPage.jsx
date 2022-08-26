import { useState } from 'react'
import { ListGroup, Row, Col, Container, Button, FloatingLabel, Form, Badge } from 'react-bootstrap'
import classNames from 'classnames'
import { equals } from 'ramda'
import { Helmet } from 'react-helmet-async'

import { CommonModal } from '../components'
import { useCreateAttestationMutation, useGetAttestationsQuery } from '../services/attestations'
import { getUniqueId } from '../utils'

export function AttestationTemplatesPage() {
    const { data: attestations } = useGetAttestationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })
    const [createAttestation] = useCreateAttestationMutation()
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false)
    const [discardWarningData, setDiscardWarningData] = useState({ isVisible: false })

    const templates = [
        {
            path: 'data/aaaaaaaaaaaaaaaaaaaa/qwerty-1.docx',
            filename: 'test-1.docx',
            idModel: '1',
            title: 'Modèle attestation 1',
            descriptionText: 'Description du modèle attestation 1',
        },
        {
            path: 'data/aaaaaaaaaaaaaaaaaaaa/asdffgghh-2.docx',
            filename: 'test-2.docx',
            idModel: '2',
            title: 'Modèle attestation 2',
            descriptionText: 'Description du modèle attestation 2',
        },
    ]

    const generateNewTemplate = () => ({
        title: 'Nouveau modèle',
        descriptionText: '',
        idModel: getUniqueId(),
    })

    const checkIsTemplateChanged = () => {
        return (
            selectedTemplateData !== null &&
            templates != null &&
            !equals(
                templates.find(({ idModel }) => idModel === selectedTemplateData.idModel),
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
                                templates.map(({ path, title, descriptionText, filename, idModel }) => (
                                    <ListGroup.Item
                                        key={idModel}
                                        onClick={() => {
                                            checkIsTemplateChanged()
                                                ? setDiscardWarningData({
                                                      isVisible: true,
                                                      selectNewTemplate: () =>
                                                          setSelectedTemplateData({
                                                              path,
                                                              filename,
                                                              idModel,
                                                              title,
                                                              descriptionText,
                                                          }),
                                                  })
                                                : setSelectedTemplateData({
                                                      path,
                                                      filename,
                                                      idModel,
                                                      title,
                                                      descriptionText,
                                                  })
                                        }}
                                        className={classNames({
                                            'active-template': selectedTemplateData?.idModel === idModel,
                                        })}
                                    >
                                        <div className="d-flex align-items-start justify-content-between">
                                            <h4 className="d-inline-block">{title}</h4>
                                        </div>
                                        {descriptionText && <p>{descriptionText}</p>}
                                    </ListGroup.Item>
                                ))}
                        </ListGroup>
                        <Button
                            variant="success"
                            onClick={() => {
                                const newTemplateData = generateNewTemplate()

                                if (checkIsTemplateChanged()) {
                                    setDiscardWarningData({
                                        isVisible: true,
                                        selectNewTemplate: () => {
                                            createAttestation({ attestationData: newTemplateData })
                                            setSelectedTemplateData(newTemplateData)
                                        },
                                    })
                                } else {
                                    createAttestation({ attestationData: newTemplateData })
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
                                    <Form.Control
                                        type="file"
                                        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={({ target: { value } }) => {
                                            const formData = new FormData()
                                            formData.append('file', value)
                                            setSelectedTemplateData({ ...selectedTemplateData, filename: formData })
                                        }}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                console.log('update attestation')
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
                                        title="Avertissement"
                                        content={<p>Êtes-vous sûr de vouloir supprimer ce modèle?</p>}
                                        footer={
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    console.log('delete attestation')
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
                                                        console.log('update attestation')
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
