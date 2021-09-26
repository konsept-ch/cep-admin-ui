import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'

import { Grid } from '../components'
import { transformFlagsToStatus } from '../utils'
import { fetchInscriptionsAction } from '../actions/inscriptions.ts'
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
            // onCellValueChanged: ({ data: { inscriptionId }, newValue }) => {
            //     ;(async () => {
            //         const inscriptionsResponse = await callService(`inscriptions/${inscriptionId}`, {
            //             method: 'post',
            //             mode: 'no-cors',
            //             body: JSON.stringify({ status: newValue }),
            //         })
            //     })()
            // },
        },
        {
            field: 'startDate',
            headerName: 'Date de début',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de début de la session',
        },
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
