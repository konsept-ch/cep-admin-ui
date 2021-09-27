import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'

import { Grid } from '../components'
import { transformFlagsToStatus } from '../utils'
import { fetchInscriptionsAction, updateInscriptionStatusAction } from '../actions/inscriptions.ts'
import { inscriptionsSelector } from '../reducers'

export function InscriptionsPage() {
    const dispatch = useDispatch()
    const inscriptions = useSelector(inscriptionsSelector)

    useEffect(() => {
        dispatch(fetchInscriptionsAction())
    }, [])

    const columnDefs = [
        {
            field: 'participant',
            headerName: 'Participant',
            filter: 'agSetColumnFilter',
            filterParams: { excelMode: 'windows' },
        },
        { field: 'profession', headerName: 'Fonction/Profession' },
        { field: 'session', headerName: 'Session', filter: 'agTextColumnFilter' },
        {
            field: 'status',
            headerName: 'Statut',
            editable: true,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
                values: [
                    'En attente',
                    'À traiter par RH',
                    'Réfusée par RH',
                    'Entrée Web',
                    'Acceptée par CEP',
                    'Invitée',
                    'Proposée',
                    'Annulée',
                    'Écartée',
                ],
            },
            onCellValueChanged: ({ data: { inscriptionId }, newValue }) => {
                ;(async () => {
                    dispatch(updateInscriptionStatusAction({ inscriptionId, newValue }))
                })()
            },
        },
        { field: 'startDate', headerName: 'Date de début', filter: 'agDateColumnFilter' },
    ]

    const rowData = inscriptions?.map(({ id: inscriptionId, user, session, validated, confirmed, date }) => ({
        inscriptionId,
        participant: user.name,
        profession: '(à faire)',
        session: session.name,
        status: transformFlagsToStatus({ validated, confirmed }),
        startDate: date,
    }))

    return (
        <Container fluid>
            <h1 className="mt-3">Inscriptions</h1>

            <Grid columnDefs={columnDefs} rowData={rowData} />
        </Container>
    )
}
