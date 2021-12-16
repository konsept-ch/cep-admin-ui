import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchSessionsAction, updateSessionAction } from '../actions/sessions.ts'
import { sessionsSelector } from '../reducers'
import { Grid } from '../components'
import { formatDate } from '../utils'
import { Helmet } from 'react-helmet-async'

export function SessionsPage() {
    const dispatch = useDispatch()
    const sessions = useSelector(sessionsSelector)

    useEffect(() => {
        dispatch(fetchSessionsAction())
    }, [])

    const columnDefs = [
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
            headerName: 'Durée',
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
            valueFormatter: ({ value }) => formatDate({ dateString: value }),
            type: 'numericColumn',
        },
        {
            field: 'lastModifiedDate',
            headerName: 'Dernière modification',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de la dernière modification',
            valueFormatter: ({ value }) => formatDate({ dateString: value }),
            type: 'numericColumn',
        },
        {
            field: 'hidden',
            headerName: 'Visibilité',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Est-ce que la session est cachée',
            valueGetter: ({ data: { hidden } }) => (hidden ? 'Cachée' : 'Visible'),
        },
        {
            field: 'invited',
            headerName: 'Invitée',
            filter: 'agTextColumnFilter',
            cellEditor: 'agRichSelectCellEditor',
            headerTooltip: 'Est-ce que la session est invitée',
            editable: true,
            valueGetter: ({ data: { invited } }) => (invited ? 'Oui' : 'Non'),
            cellEditorParams: { values: ['Oui', 'Non'] },
            onCellValueChanged: (data) =>
                dispatch(
                    updateSessionAction({
                        sessionId: data.data.id,
                        areInvitesSent: data.newValue,
                        sessionName: data.data.name,
                        startDate: data.data.startDate,
                    })
                ),
        },
    ]

    const rowData = sessions?.map(
        ({
            id,
            name,
            code,
            restrictions: { hidden, dates },
            pricing: { price },
            meta: { created, updated, duration },
            areInvitesSent,
            quotas: { days: quotaDays, used: isUsedForQuota },
        }) => ({
            id,
            name,
            code,
            duration,
            price,
            creationDate: created,
            lastModifiedDate: updated,
            hidden,
            invited: areInvitesSent,
            startDate: dates[0],
            quotaDays,
            isUsedForQuota,
        })
    )

    return (
        <>
            <Helmet>
                <title>Sessions - Former22</title>
            </Helmet>
            <Grid name="Sessions" columnDefs={columnDefs} rowData={rowData} />
        </>
    )
}
