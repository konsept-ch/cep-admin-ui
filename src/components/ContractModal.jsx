import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, ListGroup, Modal, Row } from 'react-bootstrap'
import { ConfirmInscriptionChangeButton } from '.'

import { loadingSelector } from '../reducers'
import { useGetContractsQuery } from '../services/contractTemplates'

import classNames from 'classnames'

export const ContractModal = ({ closeModal, selectedCourse, isVisible, createContract }) => {
    const {
        data: contractTemplates,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetContractsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    //console.log(contractTemplates)

    const [selectedContractTemplateUuid, setSelectedContractTemplateUuid] = useState(null)
    const isSagaLoading = useSelector(loadingSelector)

    return (
        <Modal
            show={isVisible}
            backdrop="static"
            dialogClassName="create-contract-modal"
            keyboard={false}
            onHide={() => closeModal()}
        >
            <Modal.Header closeButton>
                <Modal.Title as="h3">{selectedCourse?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className="col">
                        <h6>Choix de modèle d'attestation</h6>
                        {isLoading ? (
                            'Chargement...'
                        ) : isError ? (
                            'Erreur de chargement des modèles.'
                        ) : (
                            <ListGroup>
                                <ListGroup.Item
                                    onClick={() => {
                                        setSelectedContractTemplateUuid(null)
                                    }}
                                    className={classNames({
                                        'active-template': selectedContractTemplateUuid === null,
                                    })}
                                >
                                    <h4>Aucun contract</h4>
                                    <p>Aucun contrat ne sera généré</p>
                                </ListGroup.Item>
                                {contractTemplates.length > 0 &&
                                    contractTemplates.map(({ title, description, uuid }) => (
                                        <ListGroup.Item
                                            key={uuid}
                                            onClick={() => {
                                                setSelectedContractTemplateUuid(uuid)
                                            }}
                                            className={classNames({
                                                'active-template': selectedContractTemplateUuid === uuid,
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
                        <h6>Données du contrat</h6>
                        <p>
                            <strong>Formateur&middot;trice: </strong>
                            {selectedCourse?.user.name}
                        </p>
                        <div className="my-4 contract-sessions">
                            {selectedCourse?.sessions.map((session) => (
                                <>
                                    <strong className="py-1">{session.name.split('|')[2].trim()}</strong>
                                    <div className="contract-events">
                                        {session.events.map((event) => (
                                            <>
                                                <span className="py-1 border-top">{event.date}</span>
                                                <span className="py-1 border-top text-center">
                                                    {event.locationName}
                                                </span>
                                                <span className="py-1 border-top">
                                                    {event.startTime} - {event.endTime}
                                                </span>
                                                <span className="py-1 border-top text-end">{event.fees}</span>
                                            </>
                                        ))}
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <ConfirmInscriptionChangeButton
                    isSelectedTemplateDataNull={selectedContractTemplateUuid === null}
                    isLoading={isSagaLoading}
                    variant="primary"
                    onClick={() => createContract(selectedContractTemplateUuid)}
                >
                    Créer contrat
                </ConfirmInscriptionChangeButton>
                <Button variant="outline-primary" onClick={() => closeModal()}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
