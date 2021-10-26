import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { Collapse } from 'react-bootstrap'

export const ExpandController = ({ isRoomsExpanded, setRoomsExpanded }) => {
    return (
        <span
            className="expand-controller"
            onClick={() => {
                setRoomsExpanded(!isRoomsExpanded)
            }}
        >
            {isRoomsExpanded ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
        </span>
    )
}
