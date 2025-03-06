import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { Grid, EditSessionModal, SessionPresenceListModal } from '../components'
import { formatDate, gridContextMenu } from '../utils'
import { useGetSessionsQuery } from '../services/sessions'

export function SessionsPage() {
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
    const [isPresenceListModalOpen, setIsPresenceListModalOpen] = useState(false)
    const [selectedSessionId, setSelectedSessionId] = useState()

    const {
        data: sessions = [],
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
                field: 'quotaDays',
                headerName: 'Durée (jours)',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'La durée de la session',
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
                field: 'category',
                headerName: 'Code catégorie',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le code catégorie',
                width: 150,
            },
            {
                field: 'year',
                headerName: 'Année',
                filter: 'agTextColumnFilter',
                headerTooltip: "L'année de la session",
            },
            {
                field: 'startDate',
                headerName: 'Date de début',
                filter: 'agDateColumnFilter',
                filterParams: {
                    comparator(filterLocalDateAtMidnight, cellValue) {
                        if (cellValue === null) return 0
                        const parts = cellValue.split('.')
                        const value = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
                        return value < filterLocalDateAtMidnight ? -1 : value > filterLocalDateAtMidnight ? 1 : 0
                    },
                },
                headerTooltip: 'La date de début de la session',
                valueGetter: ({ data }) => formatDate({ dateString: data.startDate, isDateVisible: true }),
            },
            {
                field: 'coordinator',
                headerName: 'CF (coordinateur)',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le coordinateur de la formation',
                width: 170,
            },
            {
                field: 'responsible',
                headerName: 'RF (responsable)',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le responsable de la formation',
                width: 170,
            },
            {
                field: 'theme',
                headerName: 'Domaine de compétences',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le domaine de compétences de la formation',
            },
            {
                field: 'fees',
                headerName: 'Honoraires',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'les honoraires de la session',
                type: 'numericColumn',
            },
            {
                field: 'created',
                headerName: 'Date de création',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de création de la session',
                valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
                type: 'numericColumn',
                hide: true,
            },
            {
                field: 'updated',
                headerName: 'Dernière modification',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de la dernière modification',
                valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
                type: 'numericColumn',
                hide: true,
            },
            {
                field: 'occupation',
                headerName: "Nombre d'inscrits",
                filter: 'agNumberColumnFilter',
                headerTooltip: "Le nombre d'inscrits de la session",
                type: 'numericColumn',
            },
            {
                field: 'availables',
                headerName: 'Places disponibles',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'La disponibilité de la session',
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
        ],
        []
    )

    return (
        <>
            <Helmet>
                <title>Sessions - Former22</title>
            </Helmet>
            <EditSessionModal
                {...{
                    selectedSessionData: sessions.find(({ id }) => id === selectedSessionId),
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
                rowData={sessions}
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
