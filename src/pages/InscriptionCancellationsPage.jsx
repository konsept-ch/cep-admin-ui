import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import { useGetInscriptionCancellationsQuery } from '../services/inscriptions'
import { formatDate } from '../utils'
import { Grid } from '../components'

export function InscriptionCancellationsPage() {
    const { data: annulationsData, isFetching } = useGetInscriptionCancellationsQuery(null, {
        refetchOnMountOrArgChange: true,
    })

    const columnDefs = useMemo(
        () => [
            {
                field: 'startDate',
                headerName: 'Date de début',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de début de la session',
                sort: 'asc',
                valueFormatter: ({ value }) => formatDate({ dateString: value, isDateVisible: true }),
                type: 'numericColumn',
            },
            {
                field: 'participant',
                headerName: 'Participant',
                filter: 'agSetColumnFilter',
                filterParams: { excelMode: 'windows' },
                headerTooltip: "L'utilisateur qui est inscrit à la session",
                checkboxSelection: true,
                headerCheckboxSelection: true,
                aggFunc: 'count',
            },
            { field: 'profession', headerName: 'Fonction/Profession' },
            {
                field: 'sessionName',
                headerName: 'Session',
                filter: 'agTextColumnFilter',
                headerTooltip: "Le nom de la session dans laquelle l'utilisateur s'est inscrit",
                rowGroup: true,
                hide: true,
                // TODO: sort ignoring accents
                comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
                    // if (valueA == valueB) return 0;
                    // return (valueA > valueB) ? 1 : -1;
                    return valueA?.localeCompare(valueB)
                },
            },
            {
                field: 'status',
                headerName: 'Statut',
                filter: 'agSetColumnFilter',
                headerTooltip: "Le statut de l'utilisateur",
            },
            {
                field: 'organization',
                headerName: 'Organisation',
                filter: 'agTextColumnFilter',
                headerTooltip: "L'organisation de l'utilisateur",
            },
            {
                field: 'organizationCode',
                headerName: "Code de l'organisation",
                filter: 'agTextColumnFilter',
                headerTooltip: "Le code d'organization de l'utilisateur",
                initialHide: true,
            },
            {
                field: 'hierarchy',
                headerName: "Hiérarchie de l'entité/entreprise",
                filter: 'agTextColumnFilter',
                headerTooltip: "L'organisation de l'utilisateur",
                initialHide: true,
            },
            {
                field: 'email',
                headerName: 'E-mail',
                filter: 'agTextColumnFilter',
                headerTooltip: "L'e-mail de l'utilisateur",
            },
            {
                field: 'type',
                headerName: "Type d'inscription",
                filter: 'agSetColumnFilter',
                // setting default value for data resolves an uncaught type error
                valueGetter: ({ data: { type } = {} }) =>
                    ({
                        cancellation: 'Annulation',
                        learner: 'Participant',
                        tutor: 'Formateur',
                        pending: 'En attente', // ?
                        group: 'Groupe', // ?
                    }[type] ?? type),
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
        ],
        []
    )

    const rowData = annulationsData
        ?.filter((current) => current != null)
        .map(({ id, user = {}, session, status, inscriptionDate, type }) => ({
            id,
            participant: user.lastName != null ? `${user.lastName} ${user.firstName}` : 'Aucune annulation',
            profession: user.profession,
            type,
            sessionName: session.name,
            quotaDays: session.quotaDays,
            isUsedForQuota: session.isUsedForQuota,
            status,
            startDate: session.startDate,
            inscriptionDate,
            organizationCode: user.organizationCode,
            hierarchy: user.hierarchy,
            organization: user.organization,
            email: user.email,
        }))

    return (
        <>
            <Helmet>
                <title> Annulations - Former22</title>
            </Helmet>
            <Grid
                name="Annulations"
                /* TODO: decouple active filters from Grid? */
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
                autoGroupColumnDef={{
                    minWidth: 480,
                    cellRendererParams: {
                        suppressCount: true,
                    },
                }}
                defaultColDef={{
                    aggFunc: false,
                }}
                groupDefaultExpanded={0}
                groupIncludeFooter={false}
            />
        </>
    )
}
