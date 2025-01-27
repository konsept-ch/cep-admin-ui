import { useState, useEffect } from 'react'
import { Row, Modal, Button, ListGroup, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import classNames from 'classnames'
import { fetchParametersAction } from '../actions/parameters.ts'
import { fetchTemplateRawPreviewAction } from '../actions/templates.ts'
import { parametersSelector, loadingSelector, templatesLoadingSelector } from '../reducers'
import { statusWarnings, inscriptionsGridRowClassRules, formatDate } from '../utils'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'
import { useGetAttestationsQuery } from '../services/attestations'

export const MassStatusUpdateModal = ({ closeModal, inscriptionsData, updateStatus, selectedRowsData, isUpdating }) => {
    const [selectedTemplateData, setSelectedTemplateData] = useState(null)
    const [gridApi, setGridApi] = useState(null)

    const parameters = useSelector(parametersSelector)
    const isSagaLoading = useSelector(loadingSelector)
    const areTemplatesLoading = useSelector(templatesLoadingSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchParametersAction())
    }, [])

    const {
        data: attestationTemplates,
        isLoading,
        isError,
    } = useGetAttestationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    const [selectedAttestationTemplateUuid, setSelectedAttestationTemplateUuid] = useState(null)

    useEffect(() => {
        gridApi?.sizeColumnsToFit()
    }, [gridApi])

    const isEmailTemplateSelected = selectedTemplateData !== null && selectedTemplateData.templateId !== 'no-email'

    const fetchTemplatePreviews = ({ templateId }) => {
        dispatch(fetchTemplateRawPreviewAction({ templateId }))
    }

    const emailTemplates = parameters?.emailTemplates
        ? parameters.emailTemplates.filter((template) =>
              template.statuses.find((status) => status.value === inscriptionsData.newStatus)
          )
        : []

    const columnDefs = [
        {
            field: 'participant',
            headerName: 'Participant',
            filter: 'agSetColumnFilter',
            filterParams: { excelMode: 'windows' },
            headerTooltip: "L'utilisateur qui est inscrit à la session",
            aggFunc: 'count',
        },
        { field: 'profession', headerName: 'Fonction/Profession' },
        {
            field: 'sessionName',
            headerName: 'Session',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le nom de la session dans laquelle l'utilisateur s'est inscrit",
            hide: true,
        },
        {
            field: 'status',
            headerName: 'Statut',
            filter: 'agSetColumnFilter',
            headerTooltip: "Le statut de l'utilisateur",
        },
        {
            field: 'organization',
            headerName: 'Organisation',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'organisation de l'utilisateur",
        },
        {
            field: 'organizationCode',
            headerName: "Code de l'organisation",
            filter: 'agTextColumnFilter',
            headerTooltip: "Le code d'organization de l'utilisateur",
            initialHide: true,
        },
        {
            field: 'hierarchy',
            headerName: "Hiérarchie de l'entité/entreprise",
            filter: 'agTextColumnFilter',
            headerTooltip: "L'organisation de l'utilisateur",
            initialHide: true,
        },
        {
            field: 'email',
            headerName: 'E-mail',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'e-mail de l'utilisateur",
        },
        {
            field: 'type',
            headerName: "Type d'inscription",
            filter: 'agSetColumnFilter',
            // setting default value for data resolves an uncaught type error
            valueGetter: ({ data: { type } = {} }) =>
                ({
                    cancellation: 'Annulation',
                    learner: 'Participant',
                    tutor: 'Formateur',
                    pending: 'En attente', // ?
                    group: 'Groupe', // ?
                }[type] ?? type),
        },
        {
            field: 'startDate',
            headerName: 'Date de début',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de début de la session',
            sort: 'asc',
            valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
            type: 'numericColumn',
        },
        {
            field: 'quotaDays',
            headerName: 'Jours de quota',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'Les jours de quota de la session',
            type: 'numericColumn',
        },
        {
            field: 'isUsedForQuota',
            headerName: 'Utilisé pour quotas',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Les quotas de la session',
            valueGetter: ({ data }) =>
                typeof data === 'undefined' ? '' : data.isUsedForQuota ? 'Utilisé' : 'Non-utilisé',
        },
    ]

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
                                            templateId={selectedTemplateData.templateId}
                                            value={selectedTemplateData.emailSubject}
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
                                            templateId={selectedTemplateData.templateId}
                                            value={selectedTemplateData.emailBody}
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
                                            templateId={selectedTemplateData.templateId}
                                            value={selectedTemplateData.smsBody}
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
                        onGridReady={({ api }) => setGridApi(api)}
                    />
                </div>
                {(inscriptionsData.newStatus === 'Participation' || inscriptionsData.isCreatingAttestation) &&
                    (isLoading ? (
                        'Chargement...'
                    ) : isError ? (
                        'Erreur de chargement des modèles.'
                    ) : (
                        <Row>
                            <div className="col-sm-4">
                                <h6>Choix de modèle d'attestation</h6>
                                <ListGroup>
                                    <ListGroup.Item
                                        onClick={() => {
                                            setSelectedAttestationTemplateUuid('no-attestation')
                                        }}
                                        className={classNames({
                                            'active-template': selectedAttestationTemplateUuid === 'no-attestation',
                                        })}
                                    >
                                        <h4>Aucune attestation</h4>
                                        <p>Aucun attestation ne sera déposé dans l'espace personnel</p>
                                    </ListGroup.Item>
                                    {attestationTemplates.length > 0 &&
                                        attestationTemplates.map(({ title, description, uuid }) => (
                                            <ListGroup.Item
                                                key={uuid}
                                                onClick={() => {
                                                    setSelectedAttestationTemplateUuid(uuid)
                                                    // fetchTemplatePreviews({ uuid })
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
                            </div>
                        </Row>
                    ))}
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

                                updateStatus({ emailTemplateId: templateId, selectedAttestationTemplateUuid })
                            }}
                        >
                            {isSagaLoading || isUpdating ? (
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
