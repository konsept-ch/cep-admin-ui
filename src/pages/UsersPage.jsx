import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Grid, EditBtnCellRenderer, EditUserModal } from '../components'
import { useGetUsersQuery } from '../services/users'

export function UsersPage() {
    const [selectedUserData, setSelectedUserData] = useState(null)
    const {
        data: usersData,
        isFetching,
        refetch: refetchUsers,
    } = useGetUsersQuery(null, { refetchOnMountOrArgChange: true })

    const openUserEditModal = ({ data }) => {
        // workaround - passes a new object to trigger reopen when the same row is clicked
        setSelectedUserData({ ...data })
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: 'btnCellRenderer',
            headerTooltip: "Modifier l'utilisateur",
            cellClass: 'edit-column',
            pinned: 'left',
            maxWidth: 60,
            filter: false,
            sortable: false,
        },
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
        {
            field: 'telephone',
            headerName: 'Téléphone',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le téléphone de l'utilisateur",
        },
        {
            field: 'roles',
            headerName: 'Rôles',
            filter: 'agTextColumnFilter',
            headerTooltip: "Les rôles de l'utilisateur",
            valueGetter: ({ data: { roles } }) => roles.map(({ translationKey }) => translationKey).join(', '),
        },
        {
            field: 'profession',
            headerName: 'Fonction/Profession',
            filter: 'agTextColumnFilter',
            headerTooltip: "La fonction/profession de l'utilisateur",
        },
        {
            field: 'shouldReceiveSms',
            headerName: 'Recevoir des SMS',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Est-ce que cet utilisateur reçoit des SMS',
            valueGetter: ({ data: { shouldReceiveSms } }) => (shouldReceiveSms ? 'Oui' : 'Non'),
        },
    ]

    const rowData = usersData?.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.name,
        email: user.email,
        mainOrganization: user.mainOrganization?.name,
        shouldReceiveSms: user.shouldReceiveSms,
        telephone: user.phone,
        roles: user.roles,
        profession: user.profession,
    }))

    return (
        <>
            <Helmet>
                <title>Utilisateurs - Former22</title>
            </Helmet>
            <Grid
                name="Utilisateurs"
                columnDefs={columnDefs}
                rowData={rowData}
                isDataLoading={isFetching}
                components={{ btnCellRenderer: EditBtnCellRenderer({ onClick: openUserEditModal }) }}
            />
            <EditUserModal {...{ refetchUsers, selectedUserData }} />
        </>
    )
}
