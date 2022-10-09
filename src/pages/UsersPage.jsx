import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/pro-light-svg-icons'

import { Grid, EditUserModal } from '../components'
import { useGetUsersQuery } from '../services/users'

export function UsersPage() {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState()
    const {
        data: usersData,
        isFetching,
        refetch: refetchUsers,
    } = useGetUsersQuery(null, { refetchOnMountOrArgChange: true })

    const openUserEditModal = ({ data: { id } }) => {
        setSelectedUserId(id)
        setIsUserModalOpen(true)
    }

    const columnDefs = [
        {
            field: 'edit',
            headerName: '',
            cellRenderer: ({ data }) => (
                <Button
                    variant="primary"
                    onClick={() => openUserEditModal({ data })}
                    size="sm"
                    className="edit-button-style"
                >
                    <FontAwesomeIcon icon={faPen} />
                </Button>
            ),
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
            field: 'shouldReceiveSms',
            headerName: 'SMS ?',
            filter: 'agSetColumnFilter',
            headerTooltip: 'Si cet utilisateur reçoit des SMS',
            valueGetter: ({ data }) => (typeof data === 'undefined' ? '' : data.shouldReceiveSms ? 'Oui' : 'Non'),
            width: 115,
        },
        {
            field: 'colorCode',
            headerName: 'Code couleur CF',
            filter: 'agTextColumnFilter',
            headerTooltip: 'The color code of the user',
            width: 150,
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
            valueGetter: ({ data }) => (typeof data === 'undefined' ? '' : [...data.roles].sort().join(', ')),
        },
    ]

    const rowData = usersData?.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mainOrganizationName: user.mainOrganizationName,
        shouldReceiveSms: user.shouldReceiveSms,
        colorCode: user.colorCode,
        telephone: user.phone,
        phoneForSms: user.phoneForSms,
        roles: user.roles,
    }))

    return (
        <>
            <Helmet>
                <title>Utilisateurs - Former22</title>
            </Helmet>
            <Grid name="Utilisateurs" columnDefs={columnDefs} rowData={rowData} isDataLoading={isFetching} />
            <EditUserModal
                {...{
                    refetchUsers,
                    selectedUserData: rowData?.find(({ id }) => id === selectedUserId),
                    closeModal: () => {
                        setIsUserModalOpen(false)
                        setSelectedUserId()
                    },
                    isModalOpen: isUserModalOpen,
                }}
            />
        </>
    )
}
