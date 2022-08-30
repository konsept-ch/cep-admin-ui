import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import { Grid, StatusUpdateModal, MassStatusUpdateModal } from '../components'
import {
    fetchInscriptionsAction,
    updateInscriptionStatusAction,
    massUpdateInscriptionStatusesAction,
} from '../actions/inscriptions.ts'
import { inscriptionsSelector } from '../reducers'
import {
    inscriptionStatuses,
    formatDate,
    inscriptionsGridRowClassRules,
    gridContextMenu,
    FINAL_STATUSES,
    STATUSES,
    UNSELECTABLE_STATUSES,
} from '../utils'

export function InscriptionsPage() {
    const dispatch = useDispatch()
    const [statusUpdateData, setStatusUpdateData] = useState(null)
    const [statusMassUpdateData, setStatusMassUpdateData] = useState(null)
    const [selectedRowsData, setSelectedRowsData] = useState([])
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
    const [isMassUpdateModalVisible, setIsMassUpdateModalVisible] = useState(false)
    const inscriptions = useSelector(inscriptionsSelector)
    const [activePredefinedFiltersById, setActivePredefinedFiltersById] = useState({ onlyWebEntries: true })

    const predefinedFilters = [
        { id: 'onlyWebEntries', label: [STATUSES.ENTREE_WEB, STATUSES.VALIDE_PAR_RH].join('; ') },
        // { id: 'filter2', label: 'Filter 2' },
    ]

    useEffect(() => {
        dispatch(fetchInscriptionsAction())
    }, [dispatch])

    const isMassUpdatePossible =
        selectedRowsData.length > 1 &&
        selectedRowsData.every((current, index, array) => {
            const isFinalStatus = FINAL_STATUSES.includes(current.status)
            const isSameStatus = index > 0 ? array[index - 1].status === current.status : true

            if (!isFinalStatus && isSameStatus) {
                return true
            }

            return false
        })

    const checkIsSingleUpdatePossible = ({ status }) => selectedRowsData.length <= 1 && !FINAL_STATUSES.includes(status)

    const columnDefs = useMemo(
        () => [
            {
                field: 'coordinator',
                headerName: 'CF (coordinateur)',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le coordinateur de la formation',
                width: 170,
                rowGroup: true,
                hide: true,
                // TODO: sort ignoring accents
                comparator: (_valueA, _valueB, nodeA, nodeB) => {
                    return nodeA.key?.localeCompare(nodeB.key)
                },
            },
            {
                field: 'startYear',
                headerName: 'Année de début',
                filter: 'agDateColumnFilter',
                headerTooltip: "L'année de début de la session",
                sort: 'asc',
                type: 'numericColumn',
                rowGroup: true,
                hide: true,
            },
            {
                field: 'courseName',
                headerName: 'Formation',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom de la formation',
                rowGroup: true,
                hide: true,
                // TODO: sort ignoring accents
                comparator: (_valueA, _valueB, nodeA, nodeB) => {
                    return nodeA.key?.localeCompare(nodeB.key)
                },
            },
            {
                field: 'sessionName',
                headerName: 'Session',
                filter: 'agTextColumnFilter',
                headerTooltip: "Le nom de la session dans laquelle l'utilisateur s'est inscrit",
                rowGroup: true,
                hide: true,
                // TODO: sort ignoring accents
                comparator: (_valueA, _valueB, nodeA, nodeB) => {
                    return nodeA.key?.localeCompare(nodeB.key)
                },
                valueGetter: ({ data }) =>
                    `${data?.sessionName} [${
                        data?.isPending
                            ? data?.startDate
                            : formatDate({ dateString: data?.startDate, isDateVisible: true })
                    }]`,
            },
            {
                field: 'startDate',
                headerName: 'Date de début',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de début de la session',
                type: 'numericColumn',
                valueGetter: ({ data }) =>
                    data?.isPending
                        ? data?.startDate
                        : formatDate({ dateString: data?.startDate, isDateVisible: true }),
            },
            {
                field: 'participant',
                headerName: 'Participant',
                filter: 'agSetColumnFilter',
                filterParams: { excelMode: 'windows' },
                headerTooltip: "L'utilisateur qui est inscrit à la session",
                checkboxSelection: true,
                headerCheckboxSelection: true,
                aggFunc: 'count',
            },
            { field: 'profession', headerName: 'Fonction/Profession' },
            {
                field: 'status',
                headerName: 'Statut',
                filter: 'agSetColumnFilter',
                headerTooltip: "Le statut de l'utilisateur",
            },
            {
                field: 'attestationTitle',
                headerName: 'Attestation',
                filter: 'agTextColumnFilter',
                headerTooltip: "Le modèle choisi pour l'attestation de l'utilisateur",
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
        ],
        []
    )

    const rowData = inscriptions
        .filter((current) => current != null)
        .map(({ id, user, session, status, attestationTitle, inscriptionDate, type, coordinator, isPending }) => ({
            id,
            participant: `${user.lastName} ${user.firstName}`,
            profession: user.profession,
            type,
            sessionName: session.name,
            quotaDays: session.quotaDays,
            isUsedForQuota: session.isUsedForQuota,
            status,
            attestationTitle,
            startDate: session.startDate,
            inscriptionDate,
            organizationCode: user.organizationCode,
            hierarchy: user.hierarchy,
            organization: user.organization,
            email: user.email,
            coordinator,
            courseName: session.courseName,
            startYear: session.startYear,
            isPending,
        }))

    return (
        <>
            <Helmet>
                <title>Participants - Former22</title>
            </Helmet>
            <Grid
                name="Participants"
                /* TODO: decouple active filters from Grid? */
                activePredefinedFiltersById={activePredefinedFiltersById}
                setActivePredefinedFiltersById={setActivePredefinedFiltersById}
                predefinedFilters={predefinedFilters}
                columnDefs={columnDefs}
                rowData={rowData}
                rowClassRules={inscriptionsGridRowClassRules}
                autoGroupColumnDef={{
                    minWidth: 480,
                    cellRendererParams: {
                        suppressCount: true,
                    },
                }}
                defaultColDef={{
                    aggFunc: false,
                }}
                defaultSortModel={[
                    { colId: 'coordinator', sort: 'asc', sortIndex: 0 },
                    { colId: 'startYear', sort: 'asc', sortIndex: 1 },
                    { colId: 'courseName', sort: 'asc', sortIndex: 2 },
                    { colId: 'sessionName', sort: 'asc', sortIndex: 3 },
                    { colId: 'participant', sort: 'asc', sortIndex: 4 },
                ]}
                groupDefaultExpanded={1}
                groupDisplayType="groupRows"
                groupIncludeFooter={false}
                getContextMenuItems={({ node: { data } }) => [
                    {
                        name: 'Envoyer e-mail',
                        action: () => {
                            setIsUpdateModalVisible(true)
                            setStatusUpdateData({
                                ...inscriptions.find(({ id }) => id === data?.id),
                                newStatus: data?.status,
                            })
                        },
                    },
                    selectedRowsData.length <= 1 && {
                        name: 'Modifier statut',
                        disabled: !checkIsSingleUpdatePossible({ status: data?.status }),
                        tooltip: FINAL_STATUSES.includes(data?.status) ? 'Statut final (non modifiable)' : '',
                        subMenu: inscriptionStatuses.map((currentStatus) => ({
                            name: currentStatus,
                            action: () => {
                                setIsUpdateModalVisible(true)
                                setStatusUpdateData({
                                    ...inscriptions.find(({ id }) => id === data?.id),
                                    newStatus: currentStatus,
                                })
                            },
                            disabled: currentStatus === data?.status || UNSELECTABLE_STATUSES.includes(currentStatus),
                            checked: currentStatus === data?.status,
                            icon:
                                FINAL_STATUSES.includes(currentStatus) && !UNSELECTABLE_STATUSES.includes(currentStatus)
                                    ? '!'
                                    : '',
                            tooltip:
                                currentStatus === data?.status
                                    ? 'Statut actuel de la sélection'
                                    : UNSELECTABLE_STATUSES.includes(currentStatus)
                                    ? 'Statut dérivé (non sélectionnable)'
                                    : FINAL_STATUSES.includes(currentStatus)
                                    ? 'Statut final !'
                                    : '',
                        })),
                    },
                    selectedRowsData.length > 1 && {
                        name: 'Modifier statut en mass',
                        disabled: !isMassUpdatePossible,
                        tooltip: !isMassUpdatePossible ? 'Statut final (non modifiable)' : '',
                        subMenu: inscriptionStatuses.map((currentStatus) => ({
                            name: currentStatus,
                            action: () => {
                                setIsMassUpdateModalVisible(true)
                                setStatusMassUpdateData({
                                    status: data.status,
                                    newStatus: currentStatus,
                                })
                            },
                            disabled: currentStatus === data.status || UNSELECTABLE_STATUSES.includes(currentStatus),
                            checked: currentStatus === data.status,
                            icon:
                                FINAL_STATUSES.includes(currentStatus) && !UNSELECTABLE_STATUSES.includes(currentStatus)
                                    ? '!'
                                    : '',
                            tooltip:
                                currentStatus === data.status
                                    ? 'Statut actuel de la sélection'
                                    : UNSELECTABLE_STATUSES.includes(currentStatus)
                                    ? 'Statut dérivé (non sélectionnable)'
                                    : '',
                        })),
                    },
                    {
                        name: 'Créer attestation',
                        action: () => {
                            if (data != null) {
                                setIsUpdateModalVisible(true)
                                setStatusUpdateData({
                                    ...inscriptions.find(({ id }) => id === data?.id),
                                    newStatus: data?.status,
                                    isCreatingAttestation: true,
                                })
                            }
                        },
                    },
                    'separator',
                    ...gridContextMenu,
                ]}
                onRowSelected={({
                    api: {
                        selectionService: { selectedNodes },
                    },
                }) => {
                    const filteredSelectedRowsData =
                        Object.values(selectedNodes).reduce(
                            (previous, current) => [
                                ...previous,
                                ...(typeof current !== 'undefined' && typeof previous !== 'undefined'
                                    ? [current.data]
                                    : []),
                            ],
                            []
                        ) || []

                    setSelectedRowsData(filteredSelectedRowsData)
                }}
            />

            {isUpdateModalVisible && statusUpdateData && (
                <StatusUpdateModal
                    closeModal={() => {
                        setStatusUpdateData(null)
                        setIsUpdateModalVisible(false)
                        dispatch(fetchInscriptionsAction())
                    }}
                    statusUpdateData={statusUpdateData}
                    updateStatus={({ emailTemplateId, shouldSendSms, selectedAttestationTemplateUuid }) =>
                        dispatch(
                            updateInscriptionStatusAction({
                                inscriptionId: statusUpdateData.id,
                                newStatus: statusUpdateData.newStatus,
                                emailTemplateId,
                                selectedAttestationTemplateUuid,
                                shouldSendSms,
                                successCallback: () => {
                                    setIsUpdateModalVisible(false)
                                    setStatusUpdateData(null)
                                    dispatch(fetchInscriptionsAction())
                                    toast.success(
                                        `Statut d'inscription modifié de "${statusUpdateData.status}" à "${statusUpdateData.newStatus}"`
                                    )
                                },
                            })
                        )
                    }
                />
            )}

            {isMassUpdateModalVisible && statusMassUpdateData && (
                <MassStatusUpdateModal
                    closeModal={() => {
                        setIsMassUpdateModalVisible(false)
                        setStatusMassUpdateData(null)
                        dispatch(fetchInscriptionsAction())
                    }}
                    inscriptionsData={statusMassUpdateData}
                    selectedRowsData={selectedRowsData}
                    updateStatus={({ emailTemplateId }) =>
                        dispatch(
                            massUpdateInscriptionStatusesAction({
                                inscriptionsIds: selectedRowsData.map(({ id }) => id),
                                newStatus: statusMassUpdateData.newStatus,
                                emailTemplateId,
                                successCallback: () => {
                                    setIsMassUpdateModalVisible(false)
                                    setStatusMassUpdateData(null)
                                    dispatch(fetchInscriptionsAction())
                                    toast.success(
                                        `Plusieurs statuts d'inscription changés de "${statusMassUpdateData.status}" à "${statusMassUpdateData.newStatus}"`
                                    )
                                },
                            })
                        )
                    }
                />
            )}
        </>
    )
}
