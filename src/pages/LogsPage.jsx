import { Helmet } from 'react-helmet-async'
import { Grid } from '../components'

export const LogsPage = () => {
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

    return (
        <>
            <Helmet>
                <title>Logs</title>
            </Helmet>
            <Grid
                {...{
                    name: 'Logs',
                    columnDefs,
                    rowData: [],
                }}
            />
        </>
    )
}
