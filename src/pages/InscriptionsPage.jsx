import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Grid, StatusChangeModal } from '../components'
import { fetchInscriptionsAction, updateInscriptionStatusAction } from '../actions/inscriptions.ts'
import { inscriptionsSelector } from '../reducers'

export function InscriptionsPage() {
    const dispatch = useDispatch()
    const [statusChangeData, setStatusChangeData] = useState(null)
    const inscriptions = useSelector(inscriptionsSelector)

    useEffect(() => {
        dispatch(fetchInscriptionsAction())
    }, [dispatch])

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
            onCellValueChanged: ({ data: { id: currentInscriptionId }, newValue }) => {
                setStatusChangeData({
                    ...inscriptions.find(({ id }) => id === currentInscriptionId),
                    newStatus: newValue,
                })
            },
        },
        {
            field: 'startDate',
            headerName: 'Date de début',
            filter: 'agDateColumnFilter',
            headerTooltip: 'La date de début de la session',
        },
    ]

    const rowData = inscriptions?.map(({ id, user, session, status, date }) => ({
        id,
        participant: user.name,
        profession: '(à faire)',
        session: session.name,
        status,
        startDate: date,
    }))

    return (
        <>
            <Grid name="Inscriptions" columnDefs={columnDefs} rowData={rowData} />

            {statusChangeData ? (
                <StatusChangeModal
                    closeModal={() => {
                        setStatusChangeData(null)
                        dispatch(fetchInscriptionsAction())
                    }}
                    statusChangeData={statusChangeData}
                    updateStatus={({ emailTemplateName }) =>
                        dispatch(
                            updateInscriptionStatusAction({
                                inscriptionId: statusChangeData.id,
                                newStatus: statusChangeData.newStatus,
                                emailTemplateName,
                                successCallback: () => {
                                    setStatusChangeData(null)
                                    dispatch(fetchInscriptionsAction())
                                },
                            })
                        )
                    }
                />
            ) : null}
        </>
    )
}
