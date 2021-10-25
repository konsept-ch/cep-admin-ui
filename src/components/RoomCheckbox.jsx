import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons'
import { Form } from 'react-bootstrap'
import classNames from 'classnames'

const onRoomCheckboxClick =
    ({ currentlySelectedRooms, id, setSelectedRoomIds }) =>
    ({ target }) =>
        setSelectedRoomIds({ ...currentlySelectedRooms, [id]: target.checked })

export const RoomCheckbox = ({ name, id, selectedRoomIds, setSelectedRoomIds }) => (
    <li key={id} className={classNames('room-item', { 'is-visible': selectedRoomIds[id] === true })}>
        <Form.Check
            type="checkbox"
            checked={selectedRoomIds[id] === true}
            id={id}
            label={
                <>
                    {selectedRoomIds[id] === true ? (
                        <FontAwesomeIcon icon={faEye} />
                    ) : (
                        <FontAwesomeIcon icon={faEyeSlash} />
                    )}{' '}
                    <div className="room-name">{name}</div>
                </>
            }
            onChange={onRoomCheckboxClick({ currentlySelectedRooms: selectedRoomIds, id, setSelectedRoomIds })}
        />
    </li>
)
