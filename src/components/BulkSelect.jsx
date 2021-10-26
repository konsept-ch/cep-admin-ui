import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons'
import { faEye as faEyeLight } from '@fortawesome/pro-light-svg-icons'

export const BulkSelect = ({ rooms, roomsFilter, selectedRoomIds, setSelectedRoomIds }) => (
    <span
        className="bulk-select"
        onClick={() => {
            const filteredRooms = rooms.filter(roomsFilter)
            const areAllFilteredRoomsSelected = filteredRooms.every(({ id }) => selectedRoomIds[id] === true)
            setSelectedRoomIds({
                ...selectedRoomIds,
                ...filteredRooms.reduce(
                    (allRooms, { id }) => ({
                        ...allRooms,
                        [id]: !areAllFilteredRoomsSelected,
                    }),
                    {}
                ),
            })
        }}
    >
        {rooms.filter(roomsFilter).every(({ id }) => selectedRoomIds[id] === true) ? (
            <FontAwesomeIcon icon={faEye} />
        ) : rooms.filter(roomsFilter).some(({ id }) => selectedRoomIds[id] === true) ? (
            <FontAwesomeIcon icon={faEyeLight} />
        ) : (
            <FontAwesomeIcon icon={faEyeSlash} />
        )}
    </span>
)
