import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const ButtonIcon = ({ isLoading, icon }) =>
    isLoading ? (
        <Spinner animation="grow" size="sm" className="me-1" />
    ) : (
        <FontAwesomeIcon icon={icon} className="me-1" />
    )
