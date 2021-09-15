import { useState, useEffect } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/pro-light-svg-icons'

import { Calendar } from '../components'
import { MIDDLEWARE_URL } from '../constants/config'

const markAllRoomsAsSelected = ({ rooms }) => rooms.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})

export const AgendaPage = () => {
    const [isAgendaLoading, setIsAgendaLoading] = useState([])
    const [rooms, setRooms] = useState([])
    const [events, setEvents] = useState([])
    const [selectedRooms, setSelectedRooms] = useState(markAllRoomsAsSelected({ rooms }))

    useEffect(() => {
        const fetchRooms = async () => {
            setIsAgendaLoading(true)
            const response = await fetch(`${MIDDLEWARE_URL}/roomsAndEvents`)
            const roomsAndEvents = await response.json()

            if (typeof roomsAndEvents === 'object') {
                const newEvents = roomsAndEvents.events.map((event) => ({
                    ...event,
                    resourceId: event.room.id,
                    title: event.name,
                }))

                setEvents(newEvents)

                const newRooms = roomsAndEvents.rooms.map((room) => ({ ...room, title: room.name }))
                setSelectedRooms(
                    newRooms.reduce((allRooms, { id, capacity }) => ({ ...allRooms, [id]: capacity > 0 }), {})
                )
                setRooms(newRooms)
            }
            setIsAgendaLoading(false)
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
                isLoading={isAgendaLoading}
                resources={rooms.filter(({ id }) => selectedRooms[id])}
                events={events.filter(({ room: { id } }) => selectedRooms[id])}
            />
            {isAgendaLoading ? (
                'Chargement des salles...'
            ) : (
                <>
                    <div className="room-selection">
                        {rooms.map(({ title, id }) => (
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
                                        {title}
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
                </>
            )}
        </Container>
    )
}
