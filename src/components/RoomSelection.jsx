import { useState } from 'react'
import { Collapse } from 'react-bootstrap'

import { RoomCheckbox } from './RoomCheckbox'
import { BulkSelect } from './BulkSelect'
import { ExpandController } from './ExpandController'

export const RoomSelection = ({ rooms, selectedRoomIds, setSelectedRoomIds, roomsFilter, groupName }) => {
    const [isRoomsExpanded, setRoomsExpanded] = useState(true)

    return (
        <li>
            <ExpandController {...{ isRoomsExpanded, setRoomsExpanded }} />
            <BulkSelect
                {...{
                    rooms,
                    roomsFilter,
                    selectedRoomIds,
                    setSelectedRoomIds,
                }}
            />{' '}
            <strong>{groupName}</strong>
            <Collapse dimension="height" in={isRoomsExpanded}>
                <div>
                    <ul>
                        {rooms.filter(roomsFilter).map(({ name, id }) => (
                            <RoomCheckbox
                                key={id}
                                name={name}
                                id={id}
                                selectedRoomIds={selectedRoomIds}
                                setSelectedRoomIds={setSelectedRoomIds}
                            />
                        ))}
                    </ul>
                </div>
            </Collapse>
        </li>
    )
}
