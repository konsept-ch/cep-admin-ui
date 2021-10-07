import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Form, Button, Collapse } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEye,
    faEyeSlash,
    faArrowLeftFromLine,
    faArrowRightToLine,
    faChevronDown,
    faChevronRight,
} from '@fortawesome/pro-solid-svg-icons'

import { Calendar } from '../components'
import { fetchAgendaAction } from '../actions/agenda.ts'
import { roomsAndEventsSelector } from '../reducers'

const markAllRoomsAsSelected = ({ rooms }) => rooms.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})

export const AgendaPage = () => {
    const { rooms, events } = useSelector(roomsAndEventsSelector)
    const [selectedRooms, setSelectedRooms] = useState({})
    const dispatch = useDispatch()
    const [isRoomSelectionExpanded, setRoomSelectionExpanded] = useState(true)
    console.log(rooms) // to be deleted
    const [isAllRoomsExpanded, setAllRoomsExpanded] = useState(true)
    const [isInternalRoomsExpanded, setInternalRoomsExpanded] = useState(true)
    const [isPhysicalRoomsExpanded, setPhysicalRoomsExpanded] = useState(true)
    const [isVirtualRoomsExpanded, setVirtualRoomsExpanded] = useState(true)
    const [isExternalRoomsExpanded, setExternalRoomsExpanded] = useState(true)

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
                        <div className="room-name">{name}</div>
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
                <div>
                    <Collapse dimension="width" in={isRoomSelectionExpanded}>
                        <div>
                            <div className="room-selection card card-body">
                                <div>
                                    <span
                                        className="expand-controller"
                                        onClick={() => {
                                            setAllRoomsExpanded(!isAllRoomsExpanded)
                                        }}
                                    >
                                        {isAllRoomsExpanded ? (
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        ) : (
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        )}
                                    </span>
                                    <span
                                        className="bulk-select"
                                        onClick={() => {
                                            const areAllRoomsSelected = rooms.every(
                                                ({ id }) => selectedRooms[id] === true
                                            )
                                            setSelectedRooms({
                                                ...selectedRooms,
                                                ...rooms.reduce(
                                                    (allRooms, { id }) => ({
                                                        ...allRooms,
                                                        [id]: !areAllRoomsSelected,
                                                    }),
                                                    {}
                                                ),
                                            })
                                        }}
                                    >
                                        {rooms
                                            .filter(({ location }) => location?.name === 'CEP')
                                            .every(({ id }) => selectedRooms[id] === true) ? (
                                            <FontAwesomeIcon icon={faEye} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        )}
                                    </span>{' '}
                                    Toutes salles
                                    <ul className={`collapse ${isAllRoomsExpanded ? 'show' : ''}`}>
                                        <li>
                                            <span
                                                className="expand-controller"
                                                onClick={() => {
                                                    setInternalRoomsExpanded(!isInternalRoomsExpanded)
                                                }}
                                            >
                                                {isInternalRoomsExpanded ? (
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                )}
                                            </span>
                                            <span
                                                className="bulk-select"
                                                onClick={() => {
                                                    const internalRooms = rooms.filter(
                                                        ({ location }) =>
                                                            location?.name === 'CEP' || location?.name === 'CEP ZOOM'
                                                    )
                                                    const areAllInternalRoomsSelected = internalRooms.every(
                                                        ({ id }) => selectedRooms[id] === true
                                                    )
                                                    setSelectedRooms({
                                                        ...selectedRooms,
                                                        ...internalRooms.reduce(
                                                            (allRooms, { id }) => ({
                                                                ...allRooms,
                                                                [id]: !areAllInternalRoomsSelected,
                                                            }),
                                                            {}
                                                        ),
                                                    })
                                                }}
                                            >
                                                {rooms
                                                    .filter(({ location }) => location?.name === 'CEP')
                                                    .every(({ id }) => selectedRooms[id] === true) ? (
                                                    <FontAwesomeIcon icon={faEye} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                )}
                                            </span>{' '}
                                            Internes
                                            <ul className={`collapse ${isInternalRoomsExpanded ? 'show' : ''}`}>
                                                <li>
                                                    <span
                                                        className="expand-controller"
                                                        onClick={() => {
                                                            setPhysicalRoomsExpanded(!isPhysicalRoomsExpanded)
                                                        }}
                                                    >
                                                        {isPhysicalRoomsExpanded ? (
                                                            <FontAwesomeIcon icon={faChevronDown} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faChevronRight} />
                                                        )}
                                                    </span>
                                                    <span
                                                        className="bulk-select"
                                                        onClick={() => {
                                                            const physicalRooms = rooms.filter(
                                                                ({ location }) => location?.name === 'CEP'
                                                            )
                                                            const areAllPhysicalRoomsSelected = physicalRooms.every(
                                                                ({ id }) => selectedRooms[id] === true
                                                            )
                                                            setSelectedRooms({
                                                                ...selectedRooms,
                                                                ...physicalRooms.reduce(
                                                                    (allRooms, { id }) => ({
                                                                        ...allRooms,
                                                                        [id]: !areAllPhysicalRoomsSelected,
                                                                    }),
                                                                    {}
                                                                ),
                                                            })
                                                        }}
                                                    >
                                                        {rooms
                                                            .filter(({ location }) => location?.name === 'CEP')
                                                            .every(({ id }) => selectedRooms[id] === true) ? (
                                                            <FontAwesomeIcon icon={faEye} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        )}
                                                    </span>{' '}
                                                    Physiques
                                                    <ul className={`collapse ${isPhysicalRoomsExpanded ? 'show' : ''}`}>
                                                        {rooms
                                                            .filter((room) => room.location?.name === 'CEP')
                                                            .map(mapRoomsToCheckboxes)}
                                                    </ul>
                                                </li>
                                                <li>
                                                    <span
                                                        className="expand-controller"
                                                        onClick={() => {
                                                            setVirtualRoomsExpanded(!isVirtualRoomsExpanded)
                                                        }}
                                                    >
                                                        {isVirtualRoomsExpanded ? (
                                                            <FontAwesomeIcon icon={faChevronDown} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faChevronRight} />
                                                        )}
                                                    </span>
                                                    <span
                                                        className="bulk-select"
                                                        onClick={() => {
                                                            const virtualRooms = rooms.filter(
                                                                ({ location }) => location?.name === 'CEP ZOOM'
                                                            )
                                                            const areAllVirtualRoomsSelected = virtualRooms.every(
                                                                ({ id }) => selectedRooms[id] === true
                                                            )
                                                            setSelectedRooms({
                                                                ...selectedRooms,
                                                                ...virtualRooms.reduce(
                                                                    (allRooms, { id }) => ({
                                                                        ...allRooms,
                                                                        [id]: !areAllVirtualRoomsSelected,
                                                                    }),
                                                                    {}
                                                                ),
                                                            })
                                                        }}
                                                    >
                                                        {rooms
                                                            .filter(({ location }) => location?.name === 'CEP ZOOM')
                                                            .every(({ id }) => selectedRooms[id] === true) ? (
                                                            <FontAwesomeIcon icon={faEye} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        )}
                                                    </span>{' '}
                                                    Virtuelles
                                                    <ul className={`collapse ${isVirtualRoomsExpanded ? 'show' : ''}`}>
                                                        {rooms
                                                            .filter((room) => room.location?.name === 'CEP ZOOM')
                                                            .map(mapRoomsToCheckboxes)}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <span
                                                className="expand-controller"
                                                onClick={() => {
                                                    setExternalRoomsExpanded(!isExternalRoomsExpanded)
                                                }}
                                            >
                                                {isExternalRoomsExpanded ? (
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                )}
                                            </span>
                                            <span
                                                className="bulk-select"
                                                onClick={() => {
                                                    const externalRooms = rooms.filter(
                                                        ({ location }) =>
                                                            location?.name !== 'CEP' && location?.name !== 'CEP ZOOM'
                                                    )
                                                    const areAllExternalRoomsSelected = externalRooms.every(
                                                        ({ id }) => selectedRooms[id] === true
                                                    )
                                                    setSelectedRooms({
                                                        ...selectedRooms,
                                                        ...externalRooms.reduce(
                                                            (allRooms, { id }) => ({
                                                                ...allRooms,
                                                                [id]: !areAllExternalRoomsSelected,
                                                            }),
                                                            {}
                                                        ),
                                                    })
                                                }}
                                            >
                                                {rooms
                                                    .filter(
                                                        ({ location }) =>
                                                            location?.name !== 'CEP' && location?.name !== 'CEP ZOOM'
                                                    )
                                                    .every(({ id }) => selectedRooms[id] === true) ? (
                                                    <FontAwesomeIcon icon={faEye} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                )}
                                            </span>{' '}
                                            Externes
                                            <ul className={`collapse ${isExternalRoomsExpanded ? 'show' : ''}`}>
                                                {rooms
                                                    .filter(
                                                        (room) =>
                                                            room.location?.name !== 'CEP' &&
                                                            room.location?.name !== 'CEP ZOOM'
                                                    )
                                                    .map(mapRoomsToCheckboxes)}
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
                <button
                    className="toggle-room-selection btn btn-outline-primary"
                    type="button"
                    onClick={() => {
                        setRoomSelectionExpanded(!isRoomSelectionExpanded)
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
