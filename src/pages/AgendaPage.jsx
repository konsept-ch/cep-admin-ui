import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Button, Collapse, InputGroup, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftFromLine, faArrowRightToLine } from '@fortawesome/pro-solid-svg-icons'
import { faFilterCircleXmark } from '@fortawesome/pro-light-svg-icons'
import { Calendar } from '../components'
import { fetchAgendaAction } from '../actions/agenda.ts'
import { roomsAndEventsSelector } from '../reducers'

import { RoomSelection } from '../components/RoomSelection'
import { BulkSelect } from '../components/BulkSelect'
import { ExpandController } from '../components/ExpandController'

export const AgendaPage = () => {
    const { rooms, events } = useSelector(roomsAndEventsSelector)
    const [selectedRoomIds, setSelectedRoomIds] = useState({})
    const dispatch = useDispatch()
    const [isRoomSelectionExpanded, setRoomSelectionExpanded] = useState(true)
    console.log(rooms) // to be deleted
    const [isRoomsExpanded, setRoomsExpanded] = useState(true)
    const [isInternalRoomsExpanded, setInternalRoomsExpanded] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const calendarRef = useRef(null)

    useEffect(() => {
        dispatch(fetchAgendaAction())
    }, [dispatch])

    useEffect(() => {
        const initialSelectedRoomIds = rooms.reduce(
            (acc, { id, location }) => ({ ...acc, [id]: location?.name === 'CEP' }),
            {}
        )

        setSelectedRoomIds(initialSelectedRoomIds)
    }, [rooms]) // called when rooms are fetched

    const handleSearch = (e) => setSearchTerm(e.target.value)

    const searchedRooms = rooms.filter((room) =>
        room.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .includes(
                searchTerm
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
            )
    )

    return (
        <div className="calendar-page mt-3">
            <Container fluid>
                <Calendar
                    resources={searchedRooms.filter(({ id }) => selectedRoomIds[id])}
                    events={events.filter(
                        ({ room: { id } }) =>
                            selectedRoomIds[id] && searchedRooms.some((searchedRoom) => searchedRoom.id === id)
                    )}
                    calendarRef={calendarRef}
                />
            </Container>
            <div className="d-flex">
                <div>
                    <Collapse dimension="width" in={isRoomSelectionExpanded}>
                        <div>
                            <div className="room-selection card card-body">
                                <div>
                                    <div>
                                        <InputGroup className="mb-3">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 50, hide: 150 }}
                                                overlay={(props) => <Tooltip {...props}>Effacer le filtre</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-danger"
                                                    className="cleanup-button"
                                                    onClick={() => setSearchTerm('')}
                                                >
                                                    <FontAwesomeIcon icon={faFilterCircleXmark} />
                                                </Button>
                                            </OverlayTrigger>
                                            <FormControl
                                                type="text"
                                                value={searchTerm}
                                                placeholder="Rechercher"
                                                onChange={handleSearch}
                                                aria-label="Rechercher"
                                                aria-describedby="rechercher"
                                            />
                                        </InputGroup>
                                    </div>
                                    <ExpandController {...{ isRoomsExpanded, setRoomsExpanded }} />
                                    <BulkSelect
                                        {...{
                                            rooms: searchedRooms,
                                            roomsFilter: () => true,
                                            selectedRoomIds,
                                            setSelectedRoomIds,
                                        }}
                                    />{' '}
                                    <strong>Toutes salles</strong>
                                    <Collapse dimension="height" in={isRoomsExpanded}>
                                        <div>
                                            <ul>
                                                <li>
                                                    <ExpandController
                                                        {...{
                                                            isRoomsExpanded: isInternalRoomsExpanded,
                                                            setRoomsExpanded: setInternalRoomsExpanded,
                                                        }}
                                                    />
                                                    <BulkSelect
                                                        {...{
                                                            rooms: searchedRooms,
                                                            roomsFilter: ({ location }) =>
                                                                location?.name === 'CEP' ||
                                                                location?.name === 'CEP ZOOM',
                                                            selectedRoomIds,
                                                            setSelectedRoomIds,
                                                        }}
                                                    />{' '}
                                                    <strong>Internes</strong>
                                                    <Collapse dimension="height" in={isInternalRoomsExpanded}>
                                                        <div>
                                                            <ul>
                                                                <RoomSelection
                                                                    {...{
                                                                        rooms: searchedRooms,
                                                                        selectedRoomIds,
                                                                        setSelectedRoomIds,
                                                                        roomsFilter: ({ location }) =>
                                                                            location?.name === 'CEP',
                                                                        groupName: 'Physiques',
                                                                    }}
                                                                />
                                                                <RoomSelection
                                                                    {...{
                                                                        rooms: searchedRooms,
                                                                        selectedRoomIds,
                                                                        setSelectedRoomIds,
                                                                        roomsFilter: ({ location }) =>
                                                                            location?.name === 'CEP ZOOM',
                                                                        groupName: 'Virtuelles',
                                                                    }}
                                                                />
                                                            </ul>
                                                        </div>
                                                    </Collapse>
                                                </li>
                                                <RoomSelection
                                                    {...{
                                                        rooms: searchedRooms,
                                                        selectedRoomIds,
                                                        setSelectedRoomIds,
                                                        roomsFilter: ({ location }) =>
                                                            location?.name !== 'CEP' && location?.name !== 'CEP ZOOM',
                                                        groupName: 'Externes',
                                                    }}
                                                />
                                            </ul>
                                        </div>
                                    </Collapse>
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

                        setTimeout(() => calendarRef.current.getApi().updateSize(), 350)
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
