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
            field: 'lastName',
            tooltipField: 'lastName',
            headerName: 'Nom',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le nom de l'utilisateur",
            width: 140,
        },
        {
            field: 'firstName',
            tooltipField: 'firstName',
            headerName: 'Prenom',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le prenom de l'utilisateur",
            width: 140,
        },
        {
            field: 'email',
            tooltipField: 'email',
            headerName: 'E-mail',
            filter: 'agTextColumnFilter',
            headerTooltip: "L'e-mail de l'utilisateur",
            width: 230,
        },
        {
            field: 'mainOrganizationName',
            tooltipField: 'mainOrganizationName',
            headerName: 'Organisation',
            filter: 'agSetColumnFilter',
            headerTooltip: "L'organisation de l'utilisateur",
            width: 240,
        },
        // TODO org hierarchy and org code
        {
            field: 'profession',
            tooltipField: 'profession',
            headerName: 'Fonction/Profession',
            filter: 'agTextColumnFilter',
            headerTooltip: "La fonction/profession de l'utilisateur",

            width: 180,
        },
        {
            field: 'shouldReceiveSms',
            headerName: 'SMS ?',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Si cet utilisateur reçoit des SMS',
            valueGetter: ({ data: { shouldReceiveSms } }) => (shouldReceiveSms ? 'Oui' : 'Non'),
            width: 115,
        },
        {
            field: 'telephone',
            tooltipField: 'telephone',
            headerName: 'Téléphone',
            filter: 'agTextColumnFilter',
            headerTooltip: "Le téléphone de l'utilisateur",
            width: 160,
        },
        {
            field: 'phoneForSms',
            tooltipField: 'phoneForSms',
            headerName: 'Transformé',
            filter: 'agTextColumnFilter',
            headerTooltip: 'Le téléphone transformé pour SMS',
            width: 160,
        },
        {
            field: 'roles',
            headerName: 'Rôles',
            filter: 'agTextColumnFilter',
            headerTooltip: "Les rôles de l'utilisateur",
            valueGetter: ({ data: { roles } }) => [...roles].sort().join(', '),
        },
    ]

    const rowData = usersData?.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mainOrganizationName: user.mainOrganizationName,
        shouldReceiveSms: user.shouldReceiveSms,
        telephone: user.phone,
        phoneForSms: user.phoneForSms,
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
