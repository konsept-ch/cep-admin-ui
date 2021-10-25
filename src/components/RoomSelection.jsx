import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faChevronDown, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { faEye as faEyeLight } from '@fortawesome/pro-light-svg-icons'
import { RoomCheckbox } from './RoomCheckbox'
import { BulkSelect } from './BulkSelect'

export const RoomSelection = ({
    rooms,
    isRoomsExpanded,
    setRoomsExpanded,
    selectedRoomIds,
    setSelectedRoomIds,
    onRoomCheckboxClick,
    roomsFilter,
    groupName,
}) => (
    <li>
        <span
            className="expand-controller"
            onClick={() => {
                setRoomsExpanded(!isRoomsExpanded)
            }}
        >
            {isRoomsExpanded ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
        </span>
        <BulkSelect
            {...{
                rooms,
                roomsFilter,
                selectedRoomIds,
                setSelectedRoomIds,
            }}
        />{' '}
        <strong>{groupName}</strong>
        <ul className={`collapse ${isRoomsExpanded ? 'show' : ''}`}>
            {rooms.filter(roomsFilter).map(({ name, id }) => (
                <RoomCheckbox
                    name={name}
                    id={id}
                    selectedRoomIds={selectedRoomIds}
                    onRoomCheckboxClick={onRoomCheckboxClick}
                />
            ))}
        </ul>
    </li>
)
