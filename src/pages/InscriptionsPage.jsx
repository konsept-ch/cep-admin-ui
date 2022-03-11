import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
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

    useEffect(() => {
        dispatch(fetchInscriptionsAction())
    }, [dispatch])

    const isMassUpdatePossible =
        selectedRowsData.length > 1 &&
        selectedRowsData.every((current, index, array) => {
            if (!Object.values(FINAL_STATUSES).includes(current.status)) {
                return true
            }
            if (index > 0) {
                return array[index - 1].status === current.status
            }
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
                field: 'session',
                headerName: 'Session',
                filter: 'agTextColumnFilter',
                headerTooltip: "Le nom de la session dans laquelle l'utilisateur s'est inscrit",
            },
            {
                field: 'status',
                headerName: 'Statut',
                editable: ({ data: { status } }) => !Object.values(FINAL_STATUSES).includes(status),
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: inscriptionStatuses,
                },
                onCellValueChanged: ({ data: { id: currentInscriptionId }, newValue }) => {
                    setIsUpdateModalVisible(true)
                    setStatusUpdateData({
                        ...inscriptions.find(({ id }) => id === currentInscriptionId),
                        newStatus: newValue,
                    })
                },
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
                valueGetter: ({ data: { type } }) =>
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
        ],
        [inscriptions]
    )

    const rowData = inscriptions
        .filter((current) => current != null)
        .map(({ id, user, session, status, inscriptionDate, type }) => ({
            id,
            participant: `${user.firstName} ${user.lastName}`,
            profession: user.profession,
            type,
            session: session.name,
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
                <title>Inscriptions - Former22</title>
            </Helmet>
            <Grid
                name="Inscriptions"
                columnDefs={columnDefs}
                rowData={rowData}
                rowClassRules={inscriptionsGridRowClassRules}
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
                        name: 'Modifier statut en mass',
                        subMenu: inscriptionStatuses.map((current) => ({
                            name: current,
                            action: () => {
                                setIsMassUpdateModalVisible(true)
                                setStatusMassUpdateData({
                                    status: current.status,
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
                    updateStatus={({ emailTemplateId }) =>
                        dispatch(
                            updateInscriptionStatusAction({
                                inscriptionId: statusUpdateData.id,
                                newStatus: statusUpdateData.newStatus,
                                emailTemplateId,
                                successCallback: () => {
                                    setIsUpdateModalVisible(false)
                                    setStatusUpdateData(null)
                                    dispatch(fetchInscriptionsAction())
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
