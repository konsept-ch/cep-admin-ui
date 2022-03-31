import { Helmet } from 'react-helmet-async'

import { Grid } from '../components'
import { useGetUsersQuery } from '../services/users'

export function UsersPage() {
    const { data: usersData, error, isLoading } = useGetUsersQuery(null, { refetchOnMountOrArgChange: true })

    const columnDefs = [
        {
            field: 'firstName',
            headerName: 'Prenom',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le prenom de l'utilisateur",
        },
        {
            field: 'lastName',
            headerName: 'Nom',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le nom de l'utilisateur",
        },
        {
            field: 'email',
            headerName: 'E-mail',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'e-mail de l'utilisateur",
        },
        {
            field: 'mainOrganization',
            headerName: 'Organisation',
            filter: 'agSetColumnFilter',
            headerTooltip: "L'organisation de l'utilisateur",
        },
    ]

    const rowData = usersData?.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mainOrganization: user.mainOrganization?.name,
    }))

    return (
        <>
            <Helmet>
                <title>Utilisateurs - Former22</title>
            </Helmet>
            <Grid name="Utilisateurs" columnDefs={columnDefs} rowData={rowData} />
        </>
    )
}
