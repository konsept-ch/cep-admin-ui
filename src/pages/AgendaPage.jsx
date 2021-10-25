import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Form, Button, Collapse, InputGroup, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEye,
    faEyeSlash,
    faArrowLeftFromLine,
    faArrowRightToLine,
    faChevronDown,
    faChevronRight,
} from '@fortawesome/pro-solid-svg-icons'
import { faFilterCircleXmark, faEye as faEyeLight } from '@fortawesome/pro-light-svg-icons'
import classNames from 'classnames'
import { Calendar } from '../components'
import { fetchAgendaAction } from '../actions/agenda.ts'
import { roomsAndEventsSelector } from '../reducers'
import { RoomSelection } from '../components/RoomSelection'
import { BulkSelect } from '../components/BulkSelect'

export const AgendaPage = () => {
    const { rooms, events } = useSelector(roomsAndEventsSelector)
    const [selectedRoomIds, setSelectedRoomIds] = useState({})
    const dispatch = useDispatch()
    const [isRoomSelectionExpanded, setRoomSelectionExpanded] = useState(true)
    console.log(rooms) // to be deleted
    const [isAllRoomsExpanded, setAllRoomsExpanded] = useState(true)
    const [isInternalRoomsExpanded, setInternalRoomsExpanded] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

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
                                    <BulkSelect
                                        {...{
                                            rooms: searchedRooms,
                                            roomsFilter: () => true,
                                            selectedRoomIds,
                                            setSelectedRoomIds,
                                        }}
                                    />{' '}
                                    <strong>Toutes salles</strong>
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
                                            <BulkSelect
                                                {...{
                                                    rooms: searchedRooms,
                                                    roomsFilter: ({ location }) =>
                                                        location?.name === 'CEP' || location?.name === 'CEP ZOOM',
                                                    selectedRoomIds,
                                                    setSelectedRoomIds,
                                                }}
                                            />{' '}
                                            <strong>Internes</strong>
                                            <ul className={`collapse ${isInternalRoomsExpanded ? 'show' : ''}`}>
                                                <RoomSelection
                                                    {...{
                                                        rooms: searchedRooms,
                                                        selectedRoomIds,
                                                        setSelectedRoomIds,
                                                        roomsFilter: ({ location }) => location?.name === 'CEP',
                                                        groupName: 'Physiques',
                                                    }}
                                                />
                                                <RoomSelection
                                                    {...{
                                                        rooms: searchedRooms,
                                                        selectedRoomIds,
                                                        setSelectedRoomIds,
                                                        roomsFilter: ({ location }) => location?.name === 'CEP ZOOM',
                                                        groupName: 'Virtuelles',
                                                    }}
                                                />
                                            </ul>
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
