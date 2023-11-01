import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap'
import classNames from 'classnames'

const onRoomCheckboxClick =
    ({ currentlySelectedRooms, id, setSelectedRoomIds }) =>
    ({ target }) =>
        setSelectedRoomIds({ ...currentlySelectedRooms, [id]: target.checked })

export const RoomCheckbox = ({ roomName, roomId, selectedRoomIds, setSelectedRoomIds }) => (
    <li key={roomId} className={classNames('room-item', { 'is-visible': selectedRoomIds[roomId] === true })}>
        <Form.Check
            type="checkbox"
            checked={selectedRoomIds[roomId] === true}
            id={roomId}
            label={
                <>
                    {selectedRoomIds[roomId] === true ? (
                        <FontAwesomeIcon icon={faEye} />
                    ) : (
                        <FontAwesomeIcon icon={faEyeSlash} />
                    )}{' '}
                    <div className="room-name">{roomName}</div>
                </>
            }
            onChange={onRoomCheckboxClick({ currentlySelectedRooms: selectedRoomIds, id: roomId, setSelectedRoomIds })}
        />
    </li>
)
