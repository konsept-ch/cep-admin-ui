import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeftFromLine, faArrowRightToLine } from '@fortawesome/pro-solid-svg-icons'

import { Calendar } from '../components'
import { fetchAgendaAction } from '../actions/agenda.ts'
import { roomsAndEventsSelector } from '../reducers'

const markAllRoomsAsSelected = ({ rooms }) => rooms.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})

export const AgendaPage = () => {
    const { rooms, events } = useSelector(roomsAndEventsSelector)
    const [selectedRooms, setSelectedRooms] = useState(markAllRoomsAsSelected({ rooms }))
    const dispatch = useDispatch()
    const [isRoomSelectionExpanded, setRoomSelectionExpanded] = useState(true)
    console.log(rooms) // to be deleted

    useEffect(() => {
        dispatch(fetchAgendaAction())
    }, [])

    useEffect(() => {
        setSelectedRooms(rooms.reduce((allRooms, { id, capacity }) => ({ ...allRooms, [id]: capacity > 0 }), {}))
    }, [rooms])

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

    const onRoomCheckboxClick =
        ({ currentlySelectedRooms, id }) =>
        ({ target }) =>
            setSelectedRooms({ ...currentlySelectedRooms, [id]: target.checked })

    const mapRoomsToCheckboxes = ({ name, id }) => (
        <li key={id}>
            <Form.Check
                type="checkbox"
                checked={selectedRooms[id] === true}
                id={id}
                label={
                    <>
                        {selectedRooms[id] ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}{' '}
                        {name}
                    </>
                }
                onChange={onRoomCheckboxClick({ currentlySelectedRooms: selectedRooms, id })}
            />
        </li>
    )

    return (
        <div className="calendar-page mt-3">
            <Container fluid>
                <Calendar
                    resources={rooms.filter(({ id }) => selectedRooms[id])}
                    events={events.filter(({ room: { id } }) => selectedRooms[id])}
                />
            </Container>
            <div className="d-flex">
                <div className={`room-selection collapse collapse-horizontal ${isRoomSelectionExpanded ? 'show' : ''}`}>
                    <div className="card card-body">
                        <div>
                            Toutes salles
                            <ul>
                                <li>
                                    Internes
                                    <ul>
                                        <li>
                                            Physiques
                                            {rooms
                                                .filter((room) => room.location?.name === 'CEP')
                                                .map(mapRoomsToCheckboxes)}
                                        </li>
                                        <li>
                                            Virtuelles
                                            {rooms
                                                .filter((room) => room.location?.name === 'CEP ZOOM')
                                                .map(mapRoomsToCheckboxes)}
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Externes
                                    {rooms
                                        .filter(
                                            (room) =>
                                                room.location?.name !== 'CEP' && room.location?.name !== 'CEP ZOOM'
                                        )
                                        .map(mapRoomsToCheckboxes)}
                                </li>
                            </ul>
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
                    </div>
                </div>
                <button
                    className="toggle-room-selection btn btn-outline-primary"
                    type="button"
                    onClick={() => {
                        setRoomSelectionExpanded(!isRoomSelectionExpanded) // при клик извикваме set с обратното на is, типичен патърн при тогълване
                    }}
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    {isRoomSelectionExpanded ? (
                        <FontAwesomeIcon icon={faArrowRightToLine} />
                    ) : (
                        <FontAwesomeIcon icon={faArrowLeftFromLine} />
                    )}
                </button>
            </div>
        </div>
    )
}
