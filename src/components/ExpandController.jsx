import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

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
