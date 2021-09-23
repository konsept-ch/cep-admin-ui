import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons'

import { Calendar } from '../components'
import { fetchAgendaAction } from '../actions/agenda.ts'
import { roomsAndEventsSelector } from '../reducers'

const markAllRoomsAsSelected = ({ rooms }) => rooms.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})

export const AgendaPage = () => {
    const { rooms, events } = useSelector(roomsAndEventsSelector)
    const [selectedRooms, setSelectedRooms] = useState(markAllRoomsAsSelected({ rooms }))
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAgendaAction())
    }, [])

    const selectAllRooms = () => setSelectedRooms(markAllRoomsAsSelected({ rooms }))
    const unselectAllRooms = () =>
        setSelectedRooms(
            Object.keys(selectedRooms).reduce((allRooms, roomId) => ({ ...allRooms, [roomId]: false }), {})
        )
    const inverseAllRooms = () =>
        setSelectedRooms(
            Object.keys(selectedRooms).reduce(
                (allRooms, roomId) => ({ ...allRooms, [roomId]: !selectedRooms[roomId] }),
                {}
            )
        )
    const selectZoomRooms = () =>
        setSelectedRooms(
            Object.keys(selectedRooms).reduce(
                (allRooms, roomId) => ({
                    ...allRooms,
                    [roomId]: rooms.find(({ id }) => id === roomId)?.capacity === 0 ? true : selectedRooms[roomId],
                }),
                {}
            )
        )
    const removeZoomRooms = () =>
        setSelectedRooms(
            Object.keys(selectedRooms).reduce(
                (allRooms, roomId) => ({
                    ...allRooms,
                    [roomId]: rooms.find(({ id }) => id === roomId)?.capacity === 0 ? false : selectedRooms[roomId],
                }),
                {}
            )
        )

    return (
        <Container fluid className="my-3">
            <Calendar
                resources={rooms.filter(({ id }) => selectedRooms[id])}
                events={events.filter(({ room: { id } }) => selectedRooms[id])}
            />
            <div className="room-selection">
                {rooms.map(({ name, id }) => (
                    <Form.Check
                        inline
                        type="checkbox"
                        checked={selectedRooms[id]}
                        id={id}
                        key={id}
                        label={
                            <>
                                {selectedRooms[id] ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}{' '}
                                {name}
                            </>
                        }
                        onChange={({ target }) => setSelectedRooms({ ...selectedRooms, [id]: target.checked })}
                    />
                ))}
            </div>
            <div className="bulk-selection">
                <Button
                    variant="outline-primary"
                    onClick={selectAllRooms}
                    active={rooms.every(({ id }) => selectedRooms[id] === true)}
                >
                    Toutes salles ({rooms.length})
                </Button>{' '}
                <Button
                    variant="outline-primary"
                    onClick={unselectAllRooms}
                    active={!Object.values(selectedRooms).includes(true)}
                >
                    Aucune
                </Button>{' '}
                <Button variant="outline-primary" onClick={inverseAllRooms}>
                    Inverse
                </Button>{' '}
                <Button
                    variant="outline-primary"
                    onClick={selectZoomRooms}
                    active={rooms
                        .filter(({ capacity }) => capacity === 0)
                        .every(({ id }) => selectedRooms[id] === true)}
                >
                    + Zoom
                </Button>{' '}
                <Button
                    variant="outline-primary"
                    onClick={removeZoomRooms}
                    active={rooms
                        .filter(({ capacity }) => capacity === 0)
                        .every(({ id }) => selectedRooms[id] === false)}
                >
                    - Zoom
                </Button>
            </div>
        </Container>
    )
}
