import { useState } from 'react'
import { Modal, Button, ListGroup, Row } from 'react-bootstrap'
import classNames from 'classnames'
import { ConfirmInscriptionChangeButton } from '.'
import { useGetAttestationsQuery } from '../services/attestations'

export const GenerateAttestationModal = ({ show, closeModal, generateAttestation }) => {
    const [selectedAttestationTemplateUuid, setSelectedAttestationTemplateUuid] = useState(null)

    const { data: attestationTemplates = [], isLoading, isError } = useGetAttestationsQuery()

    return (
        <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false} dialogClassName="status-change-modal">
            <Modal.Header closeButton>
                <Modal.Title as="h3">Génération d'attestation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className="col">
                        {isLoading ? (
                            'Chargement...'
                        ) : isError ? (
                            'Erreur de chargement des modèles.'
                        ) : (
                            <>
                                <h6>Choix de modèle d'attestation</h6>
                                <ListGroup>
                                    <ListGroup.Item
                                        onClick={() => {
                                            setSelectedAttestationTemplateUuid(null)
                                        }}
                                        className={classNames({
                                            'active-template': selectedAttestationTemplateUuid === null,
                                        })}
                                    >
                                        <h4>Aucune attestation</h4>
                                        <p>Aucun attestation ne sera déposé dans l'espace personnel</p>
                                    </ListGroup.Item>
                                    {attestationTemplates.map(({ title, description, uuid }) => (
                                        <ListGroup.Item
                                            key={uuid}
                                            onClick={() => {
                                                setSelectedAttestationTemplateUuid(uuid)
                                            }}
                                            className={classNames({
                                                'active-template': selectedAttestationTemplateUuid === uuid,
                                            })}
                                        >
                                            <h4>{title}</h4>
                                            <p>{description}</p>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}
                    </div>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <ConfirmInscriptionChangeButton
                    variant="primary"
                    onClick={() =>
                        generateAttestation({
                            selectedAttestationTemplateUuid,
                        })
                    }
                >
                    Générer attestation
                </ConfirmInscriptionChangeButton>
                <Button variant="outline-primary" onClick={closeModal}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
