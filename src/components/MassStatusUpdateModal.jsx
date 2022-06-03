import { useState, useEffect } from 'react'
import { Modal, Button, ListGroup, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import classNames from 'classnames'
import { fetchParametersAction } from '../actions/parameters.ts'
import { fetchTemplateRawPreviewAction } from '../actions/templates.ts'
import { parametersSelector, loadingSelector, templatesLoadingSelector } from '../reducers'
import { statusWarnings, inscriptionsGridRowClassRules } from '../utils'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'

export const MassStatusUpdateModal = ({ closeModal, inscriptionsData, updateStatus, columnDefs, selectedRowsData }) => {
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)

    const parameters = useSelector(parametersSelector)
    const isSagaLoading = useSelector(loadingSelector)
    const areTemplatesLoading = useSelector(templatesLoadingSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchParametersAction())
    }, [])

    const isEmailTemplateSelected = selectedTemplateData !== null && selectedTemplateData.templateId !== 'no-email'

    const fetchTemplatePreviews = ({ templateId }) => {
        dispatch(fetchTemplateRawPreviewAction({ templateId }))
    }

    const emailTemplates = parameters?.emailTemplates
        ? parameters.emailTemplates.filter((template) =>
              template.statuses.find((status) => status.value === inscriptionsData.newStatus)
          )
        : []

    return (
        <Modal
            show
            onHide={() => closeModal()}
            backdrop="static"
            keyboard={false}
            dialogClassName="mass-status-change-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title as="h3">Modifier statut en mass</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row h-50">
                    {statusWarnings[inscriptionsData.status]?.[inscriptionsData.newStatus] && (
                        <div className="col-sm-12">
                            <Alert variant="warning">
                                {statusWarnings[inscriptionsData.status][inscriptionsData.newStatus]}
                            </Alert>
                        </div>
                    )}
                    <div className="col">
                        <Alert variant="primary">
                            <h6>Nouveau statut</h6>
                            <Alert.Heading as="h3" className="mb-0">
                                {inscriptionsData.newStatus}
                            </Alert.Heading>
                        </Alert>
                        <h6>Choix de modèle</h6>
                        <ListGroup>
                            <ListGroup.Item
                                onClick={() =>
                                    setSelectedTemplateData({
                                        templateId: 'no-email',
                                        emailBody: 'Aucun e-mail ne sera envoyé',
                                        emailSubject: null,
                                        smsSubject: null,
                                    })
                                }
                                className={classNames({
                                    'active-template': selectedTemplateData?.templateId === 'no-email',
                                })}
                            >
                                <h4>Aucun e-mail</h4>
                                <p>Aucun e-mail ne sera envoyé</p>
                            </ListGroup.Item>
                            {emailTemplates.length > 0 &&
                                emailTemplates.map(
                                    ({ title, descriptionText, emailBody, templateId, emailSubject, smsBody }) => (
                                        <ListGroup.Item
                                            key={templateId}
                                            onClick={() => {
                                                setSelectedTemplateData({
                                                    templateId,
                                                    emailBody,
                                                    emailSubject,
                                                    smsBody,
                                                })
                                                fetchTemplatePreviews({ templateId })
                                            }}
                                            className={classNames({
                                                'active-template': selectedTemplateData?.templateId === templateId,
                                            })}
                                        >
                                            <h4>{title}</h4>
                                            <p>{descriptionText}</p>
                                        </ListGroup.Item>
                                    )
                                )}
                        </ListGroup>
                    </div>
                    <div className="col template-preview">
                        <h6>Aperçu de l'e-mail</h6>
                        {isEmailTemplateSelected ? (
                            <dl>
                                <dt>Sujet de l'email</dt>
                                <dd>
                                    {!areTemplatesLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            value={{
                                                value: selectedTemplateData.emailSubject,
                                                templateId: selectedTemplateData.templateId,
                                            }}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                                <dt>Corps de l'e-mail</dt>
                                <dd>
                                    {!areTemplatesLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            value={{
                                                value: selectedTemplateData.emailBody,
                                                templateId: selectedTemplateData.templateId,
                                            }}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                                <dt>Corps de l'SMS</dt>
                                <dd>
                                    {!areTemplatesLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            value={{
                                                value: selectedTemplateData.smsBody,
                                                templateId: selectedTemplateData.templateId,
                                            }}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                            </dl>
                        ) : selectedTemplateData?.templateId === 'no-email' ? (
                            'Aucun e-mail ne sera envoyé'
                        ) : (
                            'Sélectionnez un modèle'
                        )}
                    </div>
                </div>
                <div className="ag-theme-alpine mass-status-update-grid">
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={selectedRowsData}
                        rowClassRules={inscriptionsGridRowClassRules}
                        functionsReadOnly
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip>
                            {selectedTemplateData === null
                                ? "D'abord sélectionnez un modèle"
                                : 'Appliquer le changement'}
                        </Tooltip>
                    }
                >
                    <div>
                        <Button
                            disabled={selectedTemplateData === null}
                            variant="primary"
                            onClick={() => {
                                const templateId =
                                    selectedTemplateData?.templateId === 'no-email'
                                        ? null
                                        : selectedTemplateData.templateId

                                updateStatus({ emailTemplateId: templateId })
                            }}
                        >
                            {isSagaLoading ? (
                                <>
                                    <Spinner animation="grow" size="sm" /> Confirmer...
                                </>
                            ) : (
                                'Confirmer sans SMS'
                            )}
                        </Button>
                    </div>
                </OverlayTrigger>
                <Button
                    variant="secondary"
                    onClick={() => {
                        closeModal()
                    }}
                >
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
