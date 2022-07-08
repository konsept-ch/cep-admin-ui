import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import { Grid } from '../components'
import { formatDate } from '../utils'
import { useGetSeancesQuery } from '../services/sessions'

export function SeancesPage() {
    const { data: seances, isFetching } = useGetSeancesQuery(null, { refetchOnMountOrArgChange: true })

    const columnDefs = useMemo(
        () => [
            {
                field: 'name',
                headerName: 'Titre de la séance',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom de la séance',
            },
            {
                field: 'code',
                headerName: 'Code',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le code de la séance',
            },
            {
                field: 'duration',
                headerName: 'Durée de la session (jours)',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'La durée de la session',
                type: 'numericColumn',
            },
            {
                field: 'price',
                headerName: 'Coût de la session',
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
                valueGetter: ({ data }) =>
                    typeof data === 'undefined' ? '' : data.isUsedForQuota ? 'Utilisé' : 'Non-utilisé',
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
                valueGetter: ({ data }) => (typeof data === 'undefined' ? '' : data.hidden ? 'Cachée' : 'Visible'),
            },
            {
                field: 'sessionFormat',
                headerName: 'Format de la séance',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le format de la séance',
            },
            {
                field: 'sessionLocation',
                headerName: 'Lieu de la séance',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le lieu de la séance',
            },
        ],
        []
    )

    const rowData = seances?.map(
        ({
            id,
            name,
            code,
            sessionFormat,
            sessionLocation,
            hidden,
            price,
            creationDate,
            lastModifiedDate,
            quotaDays,
            duration,
            isUsedForQuota,
        }) => ({
            id,
            name,
            code,
            duration,
            price,
            creationDate,
            lastModifiedDate,
            hidden,
            quotaDays,
            isUsedForQuota,
            sessionFormat,
            sessionLocation,
        })
    )

    return (
        <>
            <Helmet>
                <title>Séances - Former22</title>
            </Helmet>
            <Grid name="Séances" columnDefs={columnDefs} rowData={rowData} isDataLoading={isFetching} />
        </>
    )
}
