import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { Grid } from '../components'
import { logsSelector } from '../reducers'
import { fetchLogsAction } from '../actions/logs.ts'

export function LogsPage() {
    const dispatch = useDispatch()
    const logs = useSelector(logsSelector)

    useEffect(() => {
        dispatch(fetchLogsAction())
    }, [dispatch])

    const columnDefs = [
        {
            field: 'actor',
            headerName: 'Actor',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'actor de l'action",
        },
        {
            field: 'entityType',
            headerName: 'Entity type',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le type d'entité de l'action",
        },
        {
            field: 'entityName',
            headerName: 'Entity name',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le nom d'entité de l'action",
        },
        {
            field: 'actionDescription',
            headerName: 'Action description',
            filter: 'agTextColumnFilter',
            headerTooltip: "La description de l'action",
        },
        {
            field: 'dateAndTime',
            headerName: "Date et l'heure",
            filter: 'agTextColumnFilter',
            headerTooltip: "La date de l'action",
        },
        {
            field: 'status',
            headerName: 'Statut',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le statut de l'action",
        },
    ]

    const rowData = logs

    console.log(rowData)

    return (
        <>
            <Helmet>
                <title>Logs</title>
            </Helmet>
            <Grid
                {...{
                    name: 'Logs',
                    columnDefs,
                    rowData,
                }}
            />
        </>
    )
}
