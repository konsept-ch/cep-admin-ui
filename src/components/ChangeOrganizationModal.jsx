import { useState } from 'react'
import Select from 'react-select'
import { CommonModal } from './CommonModal'
import { useGetOrganizationsFlatQuery } from '../services/organizations'
import { useUpdateOrganizationMutation } from '../services/inscriptions'
import { Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

export const ChangeOrganizationModal = ({ inscriptionId, onHide, onDone }) => {
    const { data: organizations, isFetching, isSuccess } = useGetOrganizationsFlatQuery()
    const [updateOrganization, { isLoading: isOrganizationUpdating }] = useUpdateOrganizationMutation()
    const [selected, setSelected] = useState(null)

    const hide = () => {
        if (isOrganizationUpdating) return
        setSelected(null)
        onHide()
    }

    return (
        <CommonModal
            onHide={hide}
            isVisible={inscriptionId != null}
            content={
                <>
                    {isFetching && <Spinner text="Chargement" />}
                    {isSuccess && (
                        <Select
                            options={organizations.map((o) => ({ value: o.uuid, label: o.name }))}
                            onChange={(option) => setSelected(option)}
                        />
                    )}
                </>
            }
            footer={
                <div class="d-flex gap-3">
                    <Button text="Annuler" variant="secondary" onClick={hide}>
                        Annuler
                    </Button>
                    <Button
                        disabled={!selected || isOrganizationUpdating}
                        variant="primary"
                        onClick={() => {
                            updateOrganization({
                                inscriptionId,
                                organizationId: selected.value,
                            })
                                .unwrap()
                                .then(() => {
                                    hide()
                                    onDone()
                                })
                        }}
                    >
                        Sélectionner
                    </Button>
                </div>
            }
        />
    )
}
