import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { RoomCheckbox } from './RoomCheckbox'
import { BulkSelect } from './BulkSelect'

export const RoomSelection = ({ rooms, selectedRoomIds, setSelectedRoomIds, roomsFilter, groupName }) => {
    const [isRoomsExpanded, setRoomsExpanded] = useState(true)

    return (
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
                        setSelectedRoomIds={setSelectedRoomIds}
                    />
                ))}
            </ul>
        </li>
    )
}
