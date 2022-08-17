import { useEffect, useMemo } from 'react'
import { Button, Spinner, Row, Form, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { CommonModal } from '../components'
import { useUpdateSessionMutation } from '../services/sessions'
import { formatToFlatObject } from '../utils'

export function EditSessionModal({ selectedSessionData, closeModal, isModalOpen }) {
    const {
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { isDirty },
    } = useForm()

    const sessionFormatValues = useMemo(
        () => [
            { value: 'présentiel', label: 'Présentiel' },
            { value: 'visioconférence', label: 'Visioconférence' },
            { value: 'mixte', label: 'Mixte' },
            { value: 'e-learning', label: 'E-learning' },
        ],
        []
    )

    const sessionLocationValues = useMemo(
        () => [
            { value: 'lausanne', label: 'Lausanne' },
            { value: 'hors-Lausanne', label: 'Hors-Lausanne' },
        ],
        []
    )

    useEffect(() => {
        if (selectedSessionData != null) {
            reset({
                sessionFormat:
                    sessionFormatValues.find(({ label }) => label === selectedSessionData?.sessionFormat) ?? '',
                sessionLocation:
                    sessionLocationValues.find(({ label }) => label === selectedSessionData?.sessionLocation) ?? '',
            })
        }
    }, [selectedSessionData, setValue, reset, sessionFormatValues, sessionLocationValues])

    const [updateSession, { isLoading: isSessionUpdating }] = useUpdateSessionMutation()

    return (
        <CommonModal
            title={selectedSessionData?.name}
            content={
                <Row>
                    <Col>
                        <h6>Détails</h6>
                        {selectedSessionData != null && (
                            <dl>
                                <dt>Code</dt>
                                <dd>{selectedSessionData.code}</dd>
                                <dt>Durée-mail</dt>
                                <dd>{selectedSessionData.duration} jours</dd>
                                {/* <dt>Coût</dt>
                                <dd>{selectedSessionData.price}</dd> */}
                                <dt>Jours de quota</dt>
                                <dd>{selectedSessionData.quotaDays}</dd>
                                <dt>Utilisé pour quotas</dt>
                                <dd>{selectedSessionData.isUsedForQuota ? 'Utilisé' : 'Non-utilisé'}</dd>
                                <dt>Date de création</dt>
                                <dd>{selectedSessionData.creationDate}</dd>
                                <dt>Dernière modification</dt>
                                <dd>{selectedSessionData.lastModifiedDate}</dd>
                                <dt>Visibilité</dt>
                                <dd>{selectedSessionData.hidden ? 'Cachée' : 'Visible'}</dd>
                            </dl>
                        )}
                    </Col>
                    <Col sm={8}>
                        <h6>Modifier la session</h6>
                        <Row>
                            <Col>
                                <Form.Label>Format de la session</Form.Label>
                                <Controller
                                    name="sessionFormat"
                                    control={control}
                                    render={({ field }) => <Select {...field} options={sessionFormatValues} />}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Lieu de la session</Form.Label>
                                <Controller
                                    name="sessionLocation"
                                    control={control}
                                    render={({ field }) => <Select {...field} options={sessionLocationValues} />}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            }
            footer={
                <>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip>
                                {isDirty ? 'Appliquer la modification' : "Vous n'avez pas fait de modification"}
                            </Tooltip>
                        }
                    >
                        <div>
                            <Button
                                variant="primary"
                                disabled={!isDirty}
                                onClick={handleSubmit(async (newData) => {
                                    const { id, name, startDate } = selectedSessionData

                                    const { error: mutationError } = await updateSession({
                                        sessionId: id,
                                        sessionName: name,
                                        startDate,
                                        ...formatToFlatObject(newData),
                                    })
                                    if (typeof mutationError === 'undefined') {
                                        toast.success('Succès !')
                                        closeModal()
                                    } else {
                                        toast.error(
                                            <>
                                                <p>{mutationError.status}</p>
                                                <p>{mutationError.error}</p>
                                            </>,
                                            { autoClose: false }
                                        )
                                    }
                                })}
                            >
                                {isSessionUpdating ? (
                                    <>
                                        <Spinner animation="grow" size="sm" /> Confirmer...
                                    </>
                                ) : (
                                    'Confirmer'
                                )}
                            </Button>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Annuler votre modification</Tooltip>}>
                        <div>
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    closeModal()
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </OverlayTrigger>
                </>
            }
            isVisible={isModalOpen}
            onHide={() => closeModal()}
            backdrop="static"
            dialogClassName="update-modal"
        />
    )
}
