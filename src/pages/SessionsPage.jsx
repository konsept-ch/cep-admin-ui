import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchSessionsAction, updateSessionAction } from '../actions/sessions.ts'
import { sessionsSelector } from '../reducers'
import { Grid } from '../components'

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
            headerTooltip: 'Le code de la formation',
        },
        {
            field: 'duration',
            headerName: 'Durée',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'La durée de la formation',
        },
        {
            field: 'price',
            headerName: 'Coût',
            filter: 'agNumberColumnFilter',
            headerTooltip: 'Le prix de la formation',
        },
        {
            field: 'creationDate',
            headerName: 'Date de création',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de création de la formation',
        },
        {
            field: 'lastModifiedDate',
            headerName: 'Dernière modification',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de la dernière modification',
        },
        {
            field: 'hidden',
            headerName: 'Visibilité',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Est-ce que la formation est cachée',
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
                dispatch(updateSessionAction({ sessionId: data.data.id, areInvitesSent: data.newValue })),
        },
    ]

    const rowData = sessions?.map(
        ({
            id,
            name,
            code,
            restrictions: { hidden },
            pricing: { price },
            meta: { created, updated, duration },
            areInvitesSent,
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
        })
    )

    return <Grid name="Sessions" columnDefs={columnDefs} rowData={rowData} />
}
