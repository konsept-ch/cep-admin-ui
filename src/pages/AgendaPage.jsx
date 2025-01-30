import { useState, useEffect, useRef, useMemo } from 'react'
import { Container, Button, Collapse, InputGroup, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async'
import { DateTime } from 'luxon'

import { Calendar, RoomSelection, BulkSelect, ExpandController, RoomCheckbox } from '../components'
import { useGetAgendaQuery } from '../services/agenda'
import { ROOM_TYPE_VIRTUAL } from '../constants/agenda'

export const AgendaPage = () => {
    const {
        data: { rooms = [], events = [] } = {},
        refetch,
        isLoading: firstLoading,
        isFetching: loading,
    } = useGetAgendaQuery(null, { refetchOnMountOrArgChange: true })
    const [selectedRoomIds, setSelectedRoomIds] = useState({})
    const [isRoomSelectionExpanded, setRoomSelectionExpanded] = useState(true)
    const [isRoomsExpanded, setRoomsExpanded] = useState(true)
    const [isInternalRoomsExpanded, setInternalRoomsExpanded] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const calendarRef = useRef(null)

    useEffect(() => {
        if (Object.keys(selectedRoomIds).length <= 1) {
            const initialSelectedRoomIds = (rooms || []).reduce((acc, { id, location }) => ({ ...acc, [id]: true }), {
                'no-room': true,
            })

            setSelectedRoomIds(initialSelectedRoomIds)
        }
    }, [firstLoading]) // called when rooms are fetched

    const handleSearch = (e) => setSearchTerm(e.target.value)

    const searchedRooms = (rooms || []).filter((room) =>
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

    const resourcesMemoized = useMemo(
        () =>
            searchedRooms
                .filter(({ id }) => selectedRoomIds[id])
                .map((resource) => ({ ...resource, title: resource.name })),
        [searchedRooms, selectedRoomIds]
    )

    const eventsMemoized = useMemo(
        () =>
            events
                .filter(
                    ({ room }) =>
                        (selectedRoomIds[room?.id] &&
                            searchedRooms.some((searchedRoom) => searchedRoom.id === room?.id)) ||
                        (selectedRoomIds['no-room'] && (room == null || room.id === undefined))
                )
                .map((event) => ({
                    ...event,
                    title: event.name,
                    resourceId: event.room?.id,
                    start: DateTime.fromISO(event.start, { zone: 'UTC' }).toISO(),
                    end: DateTime.fromISO(event.end, { zone: 'UTC' }).toISO(),
                    display: 'block',
                })),
        [events, selectedRoomIds, searchedRooms]
    )

    return (
        <>
            <Helmet>
                <title>Agenda - Former22</title>
            </Helmet>
            <div className="calendar-page mt-3">
                <Container fluid>
                    <Calendar
                        resources={resourcesMemoized}
                        events={eventsMemoized}
                        calendarRef={calendarRef}
                        refreshCallback={refetch}
                        loading={loading}
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
                                                                    location?.name === ROOM_TYPE_VIRTUAL,
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
                                                                                location?.name === ROOM_TYPE_VIRTUAL,
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
                                                                location?.name !== 'CEP' &&
                                                                location?.name !== ROOM_TYPE_VIRTUAL,
                                                            groupName: 'Externes',
                                                        }}
                                                    />
                                                    <RoomCheckbox
                                                        roomName="Aucune salle"
                                                        roomId="no-room"
                                                        selectedRoomIds={selectedRoomIds}
                                                        setSelectedRoomIds={setSelectedRoomIds}
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
                            <FontAwesomeIcon icon={faArrowRight} />
                        ) : (
                            <FontAwesomeIcon icon={faArrowLeft} />
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}
