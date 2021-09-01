import { useState, useEffect } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Calendar } from '../components'

const markAllRoomsAsSelected = ({ rooms }) => rooms.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})
// rooms.reduce((allRooms, { id, capacity }) => ({ ...allRooms, [id]: capacity > 0 }), {})

export const AgendaPage = () => {
    const [rooms, setRooms] = useState([])
    const [events, setEvents] = useState([])
    const [selectedRooms, setSelectedRooms] = useState(markAllRoomsAsSelected({ rooms }))

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch('http://localhost:4000/roomsAndEvents')
            const roomsAndEvents = await response.json()

            if (typeof roomsAndEvents === 'object') {
                const newEvents = roomsAndEvents.events.map((event) => ({
                    ...event,
                    resourceId: event.room.id,
                    title: event.name,
                }))

                setEvents(newEvents)

                const newRooms = roomsAndEvents.rooms
                    // .filter(({ capacity }) => capacity > 0)
                    .map((room) => ({ ...room, title: room.name }))
                setSelectedRooms(
                    newRooms.reduce((allRooms, { id, capacity }) => ({ ...allRooms, [id]: capacity > 0 }), {})
                )
                setRooms(newRooms)
            }
        }

        fetchRooms()
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
            {rooms.map(({ title, id }) => (
                <Form.Check
                    inline
                    type="checkbox"
                    checked={selectedRooms[id]}
                    id={id}
                    key={id}
                    label={title}
                    onChange={({ target }) => setSelectedRooms({ ...selectedRooms, [id]: target.checked })}
                />
            ))}
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
