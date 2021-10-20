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
    faEyeLowVision,
} from '@fortawesome/pro-solid-svg-icons'
import { faFilterCircleXmark } from '@fortawesome/pro-light-svg-icons'
import classNames from 'classnames'

import { Calendar } from '../components'
import { fetchAgendaAction } from '../actions/agenda.ts'
import { roomsAndEventsSelector } from '../reducers'

export const AgendaPage = () => {
    const { rooms, events } = useSelector(roomsAndEventsSelector)
    const [selectedRoomIds, setSelectedRoomIds] = useState({})
    const dispatch = useDispatch()
    const [isRoomSelectionExpanded, setRoomSelectionExpanded] = useState(true)
    console.log(rooms) // to be deleted
    const [isAllRoomsExpanded, setAllRoomsExpanded] = useState(true)
    const [isInternalRoomsExpanded, setInternalRoomsExpanded] = useState(true)
    const [isPhysicalRoomsExpanded, setPhysicalRoomsExpanded] = useState(true)
    const [isVirtualRoomsExpanded, setVirtualRoomsExpanded] = useState(true)
    const [isExternalRoomsExpanded, setExternalRoomsExpanded] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const [temperatureValue, setTemperatureValue] = useState('')

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

    const onRoomCheckboxClick =
        ({ currentlySelectedRooms, id }) =>
        ({ target }) =>
            setSelectedRoomIds({ ...currentlySelectedRooms, [id]: target.checked })

    const mapRoomsToCheckboxes = ({ name, id }) => (
        <li key={id} className={classNames('room-item', { 'is-visible': selectedRoomIds[id] === true })}>
            <Form.Check
                type="checkbox"
                checked={selectedRoomIds[id] === true}
                id={id}
                label={
                    <>
                        {selectedRoomIds[id] === true ? (
                            <FontAwesomeIcon icon={faEye} />
                        ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                        )}{' '}
                        <div className="room-name">{name}</div>
                    </>
                }
                onChange={onRoomCheckboxClick({ currentlySelectedRooms: selectedRoomIds, id })}
            />
        </li>
    )

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
                                                    id="button-cleanup" // eventually to be deleted
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
                                    <span
                                        className="bulk-select"
                                        onClick={() => {
                                            const areAllRoomsSelected = searchedRooms.every(
                                                ({ id }) => selectedRoomIds[id] === true
                                            )
                                            setSelectedRoomIds({
                                                ...selectedRoomIds,
                                                ...searchedRooms.reduce(
                                                    (allRooms, { id }) => ({
                                                        ...allRooms,
                                                        [id]: !areAllRoomsSelected,
                                                    }),
                                                    {}
                                                ),
                                            })
                                        }}
                                    >
                                        {searchedRooms.every(({ id }) => selectedRoomIds[id] === true) ? (
                                            <FontAwesomeIcon icon={faEye} />
                                        ) : searchedRooms.some(({ id }) => selectedRoomIds[id] === true) ? (
                                            <FontAwesomeIcon icon={faEyeLowVision} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        )}
                                    </span>{' '}
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
                                            <span
                                                className="bulk-select"
                                                onClick={() => {
                                                    const internalRooms = searchedRooms.filter(
                                                        ({ location }) =>
                                                            location?.name === 'CEP' || location?.name === 'CEP ZOOM'
                                                    )
                                                    const areAllInternalRoomsSelected = internalRooms.every(
                                                        ({ id }) => selectedRoomIds[id] === true
                                                    )
                                                    setSelectedRoomIds({
                                                        ...selectedRoomIds,
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
                                                {searchedRooms
                                                    .filter(
                                                        ({ location }) =>
                                                            location?.name === 'CEP' || location?.name === 'CEP ZOOM'
                                                    )
                                                    .every(({ id }) => selectedRoomIds[id] === true) ? (
                                                    <FontAwesomeIcon icon={faEye} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                )}
                                            </span>{' '}
                                            <strong>Internes</strong>
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
                                                            const physicalRooms = searchedRooms.filter(
                                                                ({ location }) => location?.name === 'CEP'
                                                            )
                                                            const areAllPhysicalRoomsSelected = physicalRooms.every(
                                                                ({ id }) => selectedRoomIds[id] === true
                                                            )
                                                            setSelectedRoomIds({
                                                                ...selectedRoomIds,
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
                                                        {searchedRooms
                                                            .filter(({ location }) => location?.name === 'CEP')
                                                            .every(({ id }) => selectedRoomIds[id] === true) ? (
                                                            <FontAwesomeIcon icon={faEye} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        )}
                                                    </span>{' '}
                                                    <strong>Physiques</strong>
                                                    <ul className={`collapse ${isPhysicalRoomsExpanded ? 'show' : ''}`}>
                                                        {searchedRooms
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
                                                            const virtualRooms = searchedRooms.filter(
                                                                ({ location }) => location?.name === 'CEP ZOOM'
                                                            )
                                                            const areAllVirtualRoomsSelected = virtualRooms.every(
                                                                ({ id }) => selectedRoomIds[id] === true
                                                            )
                                                            setSelectedRoomIds({
                                                                ...selectedRoomIds,
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
                                                        {searchedRooms
                                                            .filter(({ location }) => location?.name === 'CEP ZOOM')
                                                            .every(({ id }) => selectedRoomIds[id] === true) ? (
                                                            <FontAwesomeIcon icon={faEye} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        )}
                                                    </span>{' '}
                                                    <strong>Virtuelles</strong>
                                                    <ul className={`collapse ${isVirtualRoomsExpanded ? 'show' : ''}`}>
                                                        {searchedRooms
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
                                                    const externalRooms = searchedRooms.filter(
                                                        ({ location }) =>
                                                            location?.name !== 'CEP' && location?.name !== 'CEP ZOOM'
                                                    )
                                                    const areAllExternalRoomsSelected = externalRooms.every(
                                                        ({ id }) => selectedRoomIds[id] === true
                                                    )
                                                    setSelectedRoomIds({
                                                        ...selectedRoomIds,
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
                                                {searchedRooms
                                                    .filter(
                                                        ({ location }) =>
                                                            location?.name !== 'CEP' && location?.name !== 'CEP ZOOM'
                                                    )
                                                    .every(({ id }) => selectedRoomIds[id] === true) ? (
                                                    <FontAwesomeIcon icon={faEye} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                )}
                                            </span>{' '}
                                            <strong>Externes</strong>
                                            <ul className={`collapse ${isExternalRoomsExpanded ? 'show' : ''}`}>
                                                {searchedRooms
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
