import { useState } from 'react'
import { Button, ListGroup, Modal, Row } from 'react-bootstrap'
import { ConfirmInscriptionChangeButton } from '.'
import { toast } from 'react-toastify'
import classNames from 'classnames'

import { useGetContractsQuery } from '../services/contractTemplates'
import { useUpdateContractMutation } from '../services/contracts'

export const ContractModal = ({ closeModal, selectedCourse, isVisible, refetchEvents }) => {
    const {
        data: contractTemplates,
        isLoading: isLoadingTemplates,
        isFetching: isFetchingTemplates,
        isError,
    } = useGetContractsQuery(null, {
        refetchOnMountOrArgChange: true,
    })
    const [updateContract, { isLoading: isUpdatingContract }] = useUpdateContractMutation()

    const [selectedContractTemplateUuid, setSelectedContractTemplateUuid] = useState(null)

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
                        {isLoadingTemplates ? (
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
                    isLoading={isFetchingTemplates || isUpdatingContract}
                    variant="primary"
                    onClick={async () => {
                        const { error } = await updateContract({
                            userId: selectedCourse.user.uuid,
                            courseId: selectedCourse.uuid,
                            templateId: selectedContractTemplateUuid,
                        })

                        if (error == null) {
                            refetchEvents()
                            closeModal()
                            toast.success('Le contrat a été généré avec succès.')
                        } else {
                            toast.error(error, { autoClose: false })
                        }
                    }}
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
