import { useState, useEffect } from 'react'
import { Row, Modal, Button, ListGroup, Alert, Spinner } from 'react-bootstrap'
import { AgGridReact } from 'ag-grid-react'
import classNames from 'classnames'
import { useGetTemplatesQuery, useLazyGetTemplateQuery } from '../services/templates.js'
import { statusWarnings, inscriptionsGridRowClassRules, formatDate } from '../utils'
import { ConfirmInscriptionChangeButton } from '.'
import { EmailTemplateBodyInput } from './EmailTemplateBodyInput'
import { useGetAttestationsQuery } from '../services/attestations'

export const MassStatusUpdateModal = ({ closeModal, inscriptionsData, updateStatus, selectedRowsData, isUpdating }) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)
    const [gridApi, setGridApi] = useState(null)

    const { data: templates = [], isLoading: isTemplatesLoading, isError: isTemplatesError } = useGetTemplatesQuery()
    const [refetchPreview, { data: preview = {}, isFetching: isPreviewLoading }] = useLazyGetTemplateQuery()

    const {
        data: attestationTemplates,
        isLoading,
        isError,
    } = useGetAttestationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    const [selectedAttestationTemplateUuid, setSelectedAttestationTemplateUuid] = useState(null)

    const emailTemplates = templates.filter((template) =>
        template.statuses.find((status) => status.value === inscriptionsData.newStatus)
    )

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

    useEffect(() => {
        gridApi?.sizeColumnsToFit()
    }, [gridApi])

    return (
        <Modal show onHide={closeModal} backdrop="static" keyboard={false} dialogClassName="mass-status-change-modal">
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
                        {isTemplatesLoading ? (
                            'Chargement...'
                        ) : isTemplatesError ? (
                            'Erreur de chargement des modèles.'
                        ) : (
                            <ListGroup>
                                <ListGroup.Item
                                    onClick={() => setSelectedTemplateId(null)}
                                    className={classNames({
                                        'active-template': selectedTemplateId === null,
                                    })}
                                >
                                    <h4>Aucun e-mail</h4>
                                    <p>Aucun e-mail ne sera envoyé</p>
                                </ListGroup.Item>
                                {emailTemplates.map(({ title, description, templateId }) => (
                                    <ListGroup.Item
                                        key={templateId}
                                        onClick={() => {
                                            refetchPreview({
                                                uuid: templateId,
                                            }).then(() => setSelectedTemplateId(templateId))
                                        }}
                                        className={classNames({
                                            'active-template': selectedTemplateId === templateId,
                                        })}
                                    >
                                        <h4>{title}</h4>
                                        <p>{description}</p>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                    <div className="col template-preview">
                        <h6>Aperçu de l'e-mail</h6>
                        {selectedTemplateId !== null ? (
                            <dl>
                                <dt>Sujet de l'email</dt>
                                <dd>
                                    {!isPreviewLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            templateId={selectedTemplateId}
                                            value={preview.emailSubject}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                                <dt>Corps de l'e-mail</dt>
                                <dd>
                                    {!isPreviewLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            templateId={selectedTemplateId}
                                            value={preview.emailBody}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                                <dt>Corps de l'SMS</dt>
                                <dd>
                                    {!isPreviewLoading ? (
                                        <EmailTemplateBodyInput
                                            className="email-preview"
                                            onChange={() => {}}
                                            templateId={selectedTemplateId}
                                            value={preview.smsBody}
                                            readOnly
                                        />
                                    ) : (
                                        <Spinner animation="grow" size="sm" />
                                    )}
                                </dd>
                            </dl>
                        ) : (
                            'Aucun e-mail ne sera envoyé'
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
                                            setSelectedAttestationTemplateUuid(null)
                                        }}
                                        className={classNames({
                                            'active-template': selectedAttestationTemplateUuid === null,
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
                <ConfirmInscriptionChangeButton
                    isLoading={isTemplatesLoading || isUpdating}
                    variant="primary"
                    onClick={() =>
                        updateStatus({ emailTemplateId: selectedTemplateId, selectedAttestationTemplateUuid })
                    }
                >
                    Confirmer sans SMS
                </ConfirmInscriptionChangeButton>
                <Button variant="secondary" onClick={closeModal}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
