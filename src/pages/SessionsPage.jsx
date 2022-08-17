import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/pro-light-svg-icons'

import { Grid, EditSessionModal, SessionPresenceListModal } from '../components'
import { formatDate, gridContextMenu } from '../utils'
import { useGetSessionsQuery } from '../services/sessions'

export function SessionsPage() {
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
    const [isPresenceListModalOpen, setIsPresenceListModalOpen] = useState(false)
    const [selectedSessionId, setSelectedSessionId] = useState()

    const {
        data: sessions,
        isFetching,
        refetch: refetchSessions,
    } = useGetSessionsQuery(null, { refetchOnMountOrArgChange: true })

    const openSessionEditModal = ({ data }) => {
        setSelectedSessionId(data.id)
        setIsSessionModalOpen(true)
    }

    const openPresenceListModal = ({ data }) => {
        setSelectedSessionId(data.id)
        setIsPresenceListModalOpen(true)
    }

    const columnDefs = useMemo(
        () => [
            {
                field: 'edit',
                headerName: '',
                cellRenderer: ({ data }) => (
                    <Button
                        variant="primary"
                        onClick={() => openSessionEditModal({ data })}
                        size="sm"
                        className="edit-button-style"
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                ),
                headerTooltip: "Modifier l'organisation",
                cellClass: 'edit-column',
                pinned: 'left',
                maxWidth: 60,
                filter: false,
                sortable: false,
            },
            {
                field: 'name',
                headerName: 'Titre de la session',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom de la session',
            },
            {
                field: 'code',
                headerName: 'Code',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le code de la session',
            },
            {
                field: 'duration',
                headerName: 'Durée (jours)',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'La durée de la session',
                type: 'numericColumn',
            },
            {
                field: 'price',
                headerName: 'Coût',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'Le prix de la session',
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
            {
                field: 'creationDate',
                headerName: 'Date de création',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de création de la session',
                valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
                type: 'numericColumn',
            },
            {
                field: 'lastModifiedDate',
                headerName: 'Dernière modification',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de la dernière modification',
                valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
                type: 'numericColumn',
            },
            {
                field: 'hidden',
                headerName: 'Visibilité',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Si la session est cachée',
                valueGetter: ({ data }) => (typeof data === 'undefined' ? '' : data.hidden ? 'Cachée' : 'Visible'),
            },
            {
                field: 'sessionFormat',
                headerName: 'Format de la session',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le format de la session',
            },
            {
                field: 'sessionLocation',
                headerName: 'Lieu de la session',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le lieu de la session',
            },
            // {
            //     field: 'invited',
            //     headerName: 'Invitée',
            //     filter: 'agTextColumnFilter',
            //     cellEditor: 'agRichSelectCellEditor',
            //     headerTooltip: 'Si la session est invitée',
            //     editable: true,
            //     valueGetter: ({ data: { invited } }) => (invited ? 'Oui' : 'Non'),
            //     cellEditorParams: { values: ['Oui', 'Non'] },
            //     onCellValueChanged: (data) => {
            //         const areInvitesSentMapper = {
            //             Oui: true,
            //             Non: false,
            //         }

            //         return dispatch(
            //             updateSessionAction({
            //                 sessionId: data.data.id,
            //                 areInvitesSent: areInvitesSentMapper[data.newValue],
            //                 sessionName: data.data.name,
            //                 startDate: data.data.startDate,
            //             })
            //         )
            //     },
            // },
        ],
        []
    )

    const rowData = sessions?.map(
        ({
            id,
            name,
            code,
            sessionFormat,
            sessionLocation,
            hidden,
            startDate,
            price,
            created,
            updated,
            quotaDays,
            areInvitesSent,
            isUsedForQuota,
        }) => ({
            id,
            name,
            code,
            duration: quotaDays,
            price,
            creationDate: created,
            lastModifiedDate: updated,
            hidden,
            invited: areInvitesSent,
            startDate,
            quotaDays,
            isUsedForQuota,
            sessionFormat,
            sessionLocation,
        })
    )

    return (
        <>
            <Helmet>
                <title>Sessions - Former22</title>
            </Helmet>
            <EditSessionModal
                {...{
                    selectedSessionData: rowData?.find(({ id }) => id === selectedSessionId),
                    closeModal: () => {
                        setIsSessionModalOpen(false)
                        setSelectedSessionId()
                        refetchSessions()
                    },
                    isModalOpen: isSessionModalOpen,
                }}
            />
            <SessionPresenceListModal
                closeModal={() => {
                    setIsPresenceListModalOpen(false)
                    setSelectedSessionId()
                    refetchSessions()
                }}
                sessionId={selectedSessionId}
                isModalOpen={isPresenceListModalOpen}
            />
            <Grid
                name="Sessions"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
                getContextMenuItems={({ node: { data } }) => [
                    {
                        name: 'Liste de présences',
                        action: () => openPresenceListModal({ data }),
                    },
                    'separator',
                    ...gridContextMenu,
                ]}
            />
        </>
    )
}
