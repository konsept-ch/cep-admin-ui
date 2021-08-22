export const transformFlagsToStatus = ({ validated, confirmed }) => {
    if (!confirmed) {
        return 'Proposée'
    } else if (!validated) {
        return 'En attente'
    } else {
        return 'Entrée web'
    }
}
