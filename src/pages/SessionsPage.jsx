import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Grid, EditBtnCellRenderer, EditSessionModal } from '../components'
import { formatDate } from '../utils'
import { useGetSessionsQuery } from '../services/sessions'

export function SessionsPage() {
    const [selectedSessionData, setSelectedSessionData] = useState()

    const {
        data: sessions,
        isFetching,
        refetch: refetchSessions,
    } = useGetSessionsQuery(null, { refetchOnMountOrArgChange: true })

    const openSessionEditModal = ({ data }) => {
        // workaround - passes a new object to trigger reopen when the same row is clicked
        setSelectedSessionData({ ...data })
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: 'btnCellRenderer',
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
            valueGetter: ({ data: { isUsedForQuota } }) => (isUsedForQuota ? 'Utilisé' : 'Non-utilisé'),
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
            valueGetter: ({ data: { hidden } }) => (hidden ? 'Cachée' : 'Visible'),
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
    ]

    const rowData = sessions?.map(
        ({
            id,
            name,
            code,
            sessionFormat,
            sessionLocation,
            restrictions: { hidden, dates },
            pricing: { price },
            meta: { created, updated, days },
            areInvitesSent,
            quotas: { days: quotaDays, used: isUsedForQuota },
        }) => ({
            id,
            name,
            code,
            duration: days,
            price,
            creationDate: created,
            lastModifiedDate: updated,
            hidden,
            invited: areInvitesSent,
            startDate: dates[0],
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
            <EditSessionModal {...{ refetchSessions, selectedSessionData }} />
            <Grid
                name="Sessions"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openSessionEditModal }) }}
            />
        </>
    )
}
