import React, { useState, useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import { Calendar } from '../components'

const selectAllRooms = ({ rooms }) => rooms.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})

export const AgendaPage = () => {
    const [rooms, setRooms] = useState([])
    const [events, setEvents] = useState([])
    const [selectedRooms, setSelectedRooms] = useState(selectAllRooms({ rooms }))

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
                    .filter((room) => room.capacity > 0)
                    .map((room) => ({ ...room, title: room.name }))
                setSelectedRooms(selectAllRooms({ rooms: newRooms }))
                setRooms(newRooms)
            }
        }

        fetchRooms()
    }, [])

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
                    label={title}
                    onChange={({ target }) => setSelectedRooms({ ...selectedRooms, [id]: target.checked })}
                />
            ))}
        </Container>
    )
}

AgendaPage.displayName = 'AgendaPage'
