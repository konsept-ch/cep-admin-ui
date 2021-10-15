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
    faFilterCircleXmark,
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
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(fetchAgendaAction())
    }, [])

    useEffect(() => {
        setSelectedRooms(
            rooms.reduce((allRooms, { id, location }) => ({ ...allRooms, [id]: location?.name === 'CEP' }), {})
        )
    }, [rooms])

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

    const handleSearch = (e) => setSearchTerm(e.target.value)

    const searchedRooms = rooms.filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="calendar-page mt-3">
            <Container fluid>
                <Calendar
                    resources={searchedRooms.filter(({ id }) => selectedRooms[id])}
                    events={events.filter(({ room: { id } }) => selectedRooms[id])}
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
                                                    id="button-addon1"
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
                                                ({ id }) => selectedRooms[id] === true
                                            )
                                            setSelectedRooms({
                                                ...selectedRooms,
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
                                        {searchedRooms.every(({ id }) => selectedRooms[id] === true) ? (
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
                                                    const internalRooms = searchedRooms.filter(
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
                                                {searchedRooms
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
                                                            const physicalRooms = searchedRooms.filter(
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
                                                        {searchedRooms
                                                            .filter(({ location }) => location?.name === 'CEP')
                                                            .every(({ id }) => selectedRooms[id] === true) ? (
                                                            <FontAwesomeIcon icon={faEye} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        )}
                                                    </span>{' '}
                                                    Physiques
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
                                                        {searchedRooms
                                                            .filter(({ location }) => location?.name === 'CEP ZOOM')
                                                            .every(({ id }) => selectedRooms[id] === true) ? (
                                                            <FontAwesomeIcon icon={faEye} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        )}
                                                    </span>{' '}
                                                    Virtuelles
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
                                                {searchedRooms
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
