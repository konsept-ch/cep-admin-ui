import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'

import { Grid } from '../components'
import { fetchFormateursAction } from '../actions/formateurs.ts'
import { formateursSelector } from '../reducers'
import { formatDate } from '../utils'

export function FormateursPage() {
    const dispatch = useDispatch()
    const formateurs = useSelector(formateursSelector)

    useEffect(() => {
        dispatch(fetchFormateursAction())
    }, [dispatch])

    const columnDefs = useMemo(
        () => [
            {
                field: 'teacher',
                headerName: 'Formateur',
                filter: 'agSetColumnFilter',
                filterParams: { excelMode: 'windows' },
                headerTooltip: 'Le formateur de la session',
                rowGroup: true,
            },
            {
                field: 'course',
                headerName: 'Formation',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom de la formation',
                rowGroup: true,
                // TODO: sort ignoring accents
                comparator: (_valueA, _valueB, nodeA, nodeB) => {
                    return nodeA.key?.localeCompare(nodeB.key)
                },
            },
            {
                field: 'session',
                headerName: 'Session',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom de la session que le formateur donne',
                rowGroup: true,
            },
            {
                field: 'status',
                headerName: 'Statut',
                filter: 'agSetColumnFilter',
                headerTooltip: 'Le statut du formateur',
            },
            {
                field: 'organization',
                headerName: 'Organisation',
                filter: 'agTextColumnFilter',
                headerTooltip: "L'organisation du formateur",
            },
            {
                field: 'organizationCode',
                headerName: "Code de l'organisation",
                filter: 'agTextColumnFilter',
                headerTooltip: "Le code d'organization du formateur",
                initialHide: true,
            },
            {
                field: 'hierarchy',
                headerName: "Hiérarchie de l'entité/entreprise",
                filter: 'agTextColumnFilter',
                headerTooltip: "La hiérarchie de l'organisation du formateur",
                initialHide: true,
            },
            {
                field: 'email',
                headerName: 'E-mail',
                filter: 'agTextColumnFilter',
                headerTooltip: "L'e-mail du formateur",
            },
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
                field: 'contract',
                headerName: 'Contrat',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le modèle choisi pour le contrat',
            },
        ],
        []
    )

    const rowData = formateurs
        .filter((current) => current != null)
        .map(({ id, user = {}, session, status, contract }) => ({
            id,
            participant: user.lastName != null ? `${user.lastName} ${user.firstName}` : 'Aucun formateur',
            session: session.name,
            status,
            contract,
            organization: user.organization,
            organizationCode: user.organizationCode,
            hierarchy: user.hierarchy,
            email: user.email,
            startDate: session.startDate,
        }))

    return (
        <>
            <Helmet>
                <title>Formateurs - Former22</title>
            </Helmet>
            <Grid name="Formateurs" columnDefs={columnDefs} rowData={rowData} />
        </>
    )
}
