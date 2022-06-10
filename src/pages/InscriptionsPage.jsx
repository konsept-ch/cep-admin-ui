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
        { id: 'onlyWebEntries', label: 'Entrées Web uniquement' },
        // { id: 'filter2', label: 'Filter 2' },
    ]

    useEffect(() => {
        dispatch(fetchInscriptionsAction())
    }, [dispatch])

    const isMassUpdatePossible =
        selectedRowsData.length > 1 &&
        selectedRowsData.every((current, index, array) => {
            const isFinalStatus = Object.values(FINAL_STATUSES).includes(current.status)
            const isSameStatus = index > 0 ? array[index - 1].status === current.status : true

            if (!isFinalStatus && isSameStatus) {
                return true
            }

            return false
        })

    const columnDefs = useMemo(
        () => [
            {
                field: 'participant',
                headerName: 'Participant',
                filter: 'agSetColumnFilter',
                filterParams: { excelMode: 'windows' },
                headerTooltip: "L'utilisateur qui est inscrit à la session",
                checkboxSelection: true,
                headerCheckboxSelection: true,
            },
            { field: 'profession', headerName: 'Fonction/Profession' },
            {
                field: 'sessionName',
                headerName: 'Session',
                filter: 'agTextColumnFilter',
                headerTooltip: "Le nom de la session dans laquelle l'utilisateur s'est inscrit",
                rowGroup: true,
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
                    typeof data !== 'undefined' ? (data.isUsedForQuota ? 'Utilisé' : 'Non-utilisé') : '',
                // valueGetter: ({ data: { isUsedForQuota } }) => (isUsedForQuota ? 'Utilisé' : 'Non-utilisé'),
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
        ],
        []
    )

    const rowData = inscriptions
        .filter((current) => current != null)
        .map(({ id, user, session, status, inscriptionDate, type }) => ({
            id,
            participant: `${user.lastName} ${user.firstName}`,
            profession: user.profession,
            type,
            sessionName: session.name,
            quotaDays: session.quotaDays,
            isUsedForQuota: session.isUsedForQuota,
            status,
            startDate: session.startDate,
            inscriptionDate,
            organizationCode: user.organizationCode,
            hierarchy: user.hierarchy,
            organization: user.organization,
            email: user.email,
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
                groupDefaultExpanded={0}
                groupIncludeFooter={false}
                getContextMenuItems={({ node: { data } }) => [
                    {
                        name: 'Envoyer e-mail',
                        action: () => {
                            setIsUpdateModalVisible(true)
                            setStatusUpdateData({
                                ...inscriptions.find(({ id }) => id === data.id),
                                newStatus: data.status,
                            })
                        },
                    },
                    {
                        name: 'Modifier statut',
                        subMenu: inscriptionStatuses.map((current) => ({
                            name: current,
                            action: () => {
                                setIsUpdateModalVisible(true)
                                setStatusUpdateData({
                                    ...inscriptions.find(({ id }) => id === data.id),
                                    newStatus: current,
                                })
                            },
                        })),
                        disabled: Object.values(FINAL_STATUSES).includes(data.status),
                    },
                    {
                        name: 'Modifier statut en mass',
                        subMenu: inscriptionStatuses.map((current) => ({
                            name: current,
                            action: () => {
                                setIsMassUpdateModalVisible(true)
                                setStatusMassUpdateData({
                                    status: data.status,
                                    newStatus: current,
                                })
                            },
                        })),
                        disabled: !isMassUpdatePossible,
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
                    updateStatus={({ emailTemplateId, shouldSendSms }) =>
                        dispatch(
                            updateInscriptionStatusAction({
                                inscriptionId: statusUpdateData.id,
                                newStatus: statusUpdateData.newStatus,
                                emailTemplateId,
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
                    columnDefs={columnDefs}
                />
            )}
        </>
    )
}
