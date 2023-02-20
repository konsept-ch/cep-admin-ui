import { useState } from 'react'
import { Button, ListGroup, Modal, Row } from 'react-bootstrap'
import { ConfirmInscriptionChangeButton } from '.'
import classNames from 'classnames'

import { useGetEvaluationsQuery } from '../services/evaluationTemplates'

export const EvaluationModal = ({ closeModal, isVisible }) => {
    const {
        data: evaluationTemplates,
        isLoading: isLoadingTemplates,
        isFetching: isFetchingTemplates,
        isError,
    } = useGetEvaluationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    const [selectedTemplateUuid, setSelectedTemplateUuid] = useState(null)

    return (
        <Modal
            show={isVisible}
            backdrop="static"
            size="lg"
            dialogClassName="create-evaluation-modal"
            keyboard={false}
            onHide={() => closeModal()}
        >
            <Modal.Header closeButton>
                <Modal.Title as="h3">Génération d'évaluation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className="col">
                        <h6>Choix de modèle d'évaluation</h6>
                        {isLoadingTemplates ? (
                            'Chargement...'
                        ) : isError ? (
                            'Erreur de chargement des modèles.'
                        ) : (
                            <ListGroup>
                                {evaluationTemplates.map(({ title, description, uuid }) => (
                                    <ListGroup.Item
                                        key={uuid}
                                        onClick={() => {
                                            setSelectedTemplateUuid(uuid)
                                        }}
                                        className={classNames({
                                            'active-template': selectedTemplateUuid === uuid,
                                        })}
                                    >
                                        <h4>{title}</h4>
                                        <p>{description}</p>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                    <div className="col">
                        <h6>Choix de la session</h6>
                    </div>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <ConfirmInscriptionChangeButton
                    isSelectedTemplateDataNull={selectedTemplateUuid === null}
                    isLoading={isFetchingTemplates}
                    variant="primary"
                    onClick={async () => {}}
                >
                    Générer évaluation
                </ConfirmInscriptionChangeButton>
                <Button
                    variant="outline-primary"
                    onClick={() => {
                        setSelectedTemplateUuid(null)
                        closeModal()
                    }}
                >
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
