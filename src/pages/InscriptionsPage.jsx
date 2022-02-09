import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, StatusChangeModal } from '../components'
import { fetchInscriptionsAction, updateInscriptionStatusAction } from '../actions/inscriptions.ts'
import { inscriptionsSelector } from '../reducers'
import { inscriptionStatuses, formatDate, statuses } from '../utils'
import { Helmet } from 'react-helmet-async'

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
                values: inscriptionStatuses,
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
            sort: 'asc',
            // valueFormatter: ({ value }) => formatDate({ dateString: value }),
            type: 'numericColumn',
        },
    ]

    const rowData = inscriptions
        .filter((current) => current != null)
        .map(({ id, user, session, status, inscriptionDate }) => ({
            id,
            participant: `${user.firstName} ${user.lastName}`,
            profession: '(à faire)',
            session: session.name,
            status,
            startDate: session.startDate,
            inscriptionDate,
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
                rowClassRules={{
                    'inscription-row-highlight': ({ data: { inscriptionDate, startDate, status } = {} }) => {
                        const milisecondsIn5days = 1000 * 60 * 60 * 24 * 5
                        const isSession5daysAfterInscription =
                            new Date(startDate).getTime() - new Date(inscriptionDate).getTime() <= milisecondsIn5days

                        const isInscriptionIncoming =
                            status === statuses.ENTREE_WEB || status === statuses.A_TRAITER_PAR_RH

                        return isSession5daysAfterInscription && isInscriptionIncoming
                    },
                }}
                getContextMenuItems={({ node: { data } }) => [
                    {
                        name: 'Envoyer e-mail',
                        action: () => {
                            setStatusChangeData({
                                ...inscriptions.find(({ id }) => id === data.id),
                                newStatus: data.status,
                            })
                        },
                    },
                    'separator',
                    'autoSizeAll',
                    'expandAll',
                    'contractAll',
                    'copy',
                    'copyWithHeaders',
                    'paste',
                    'resetColumns',
                    'export',
                    'chartRange',
                ]}
            />

            {statusChangeData ? (
                <StatusChangeModal
                    closeModal={() => {
                        setStatusChangeData(null)
                        dispatch(fetchInscriptionsAction())
                    }}
                    statusChangeData={statusChangeData}
                    updateStatus={({ emailTemplateId }) =>
                        dispatch(
                            updateInscriptionStatusAction({
                                inscriptionId: statusChangeData.id,
                                newStatus: statusChangeData.newStatus,
                                emailTemplateId,
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
