import { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Offcanvas } from 'react-bootstrap'
import classNames from 'classnames'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import luxon2Plugin from '@fullcalendar/luxon2'
import frLocale from '@fullcalendar/core/locales/fr'
import adaptivePlugin from '@fullcalendar/adaptive'
import { DateTime } from 'luxon'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faRefresh } from '@fortawesome/pro-solid-svg-icons'

import { loadingSelector } from '../reducers'
import { DATE_FORMAT_OPTIONS, DATE_FORMAT_SWISS_FRENCH } from '../constants/constants'
import { Event } from './Event'

export const Calendar = ({ resources, events, calendarRef, refreshCallback }) => {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const isSagaLoading = useSelector(loadingSelector)

    const eventsMemoized = useMemo(
        () =>
            events.map((event) => ({
                ...event,
                title: event.name,
                resourceId: event.room?.id,
                // start: Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, {
                //     hour: 'numeric',
                //     minute: 'numeric',
                // }).format(new Date(event.start)),
                start: DateTime.fromISO(event.start, { zone: 'UTC' }).toISO(),
                end: DateTime.fromISO(event.end, { zone: 'UTC' }).toISO(),
                display: 'block',
            })),
        [events]
    )

    const resourcesMemoized = useMemo(
        () => resources.map((resource) => ({ ...resource, title: resource.name })),
        [resources]
    )

    const customButtons = useMemo(
        () => ({
            myCustomButton: {
                text: isSagaLoading ? '...' : '↺',
                // icon: 'arrow-clockwise',
                // text: (
                //     <div>
                //         <FontAwesomeIcon
                //             className={classNames('refresh-agenda', { 'is-loader': isSagaLoading })}
                //             icon={faRefresh}
                //         />
                //     </div>
                // ),
                click: refreshCallback,
                hint: 'Rafraîchir données de Claroline',
            },
        }),
        [isSagaLoading, refreshCallback]
    )

    const eventOrder = useCallback(
        (eventA, eventB) =>
            eventA.room?.name < eventB.room?.name ? -1 : eventA.room?.name > eventB.room?.name ? 1 : 0,
        []
    )

    const eventClick = useCallback((info) => {
        info.jsEvent.preventDefault()
        setSelectedEvent({ ...info.event._def, range: info.event._instance.range })
    }, [])

    const eventContent = useCallback(
        ({ event }) => (
            <div className="event-wrapper" style={{ background: `#${event._def.extendedProps.coordinatorColorCode}` }}>
                <b>
                    <span
                        className={classNames('event-content-room', {
                            'is-first-physical': event._def.extendedProps.isFirstPhysical,
                        })}
                    >
                        {event._def.extendedProps.room?.name}
                    </span>
                    <span className="event-content-divider">|</span>
                    {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, DATE_FORMAT_OPTIONS).format(
                        new Date(event._instance.range.start)
                    )}
                </b>
                <br />
                <i>{event.title}</i>
            </div>
        ),
        []
    )

    return (
        <>
            <FullCalendar
                ref={calendarRef}
                nowIndicator
                editable
                navLinks
                aspectRatio={3}
                allDaySlot={false}
                locale={frLocale}
                // timeZone="Europe/Zurich"
                eventOrder={eventOrder}
                resources={resourcesMemoized}
                events={eventsMemoized}
                resourceAreaHeaderContent="Salles"
                height="100%"
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                initialView="dayGridWeek"
                // themeSystem="bootstrap5"
                customButtons={customButtons}
                headerToolbar={{
                    left: 'today prev,next myCustomButton',
                    center: 'title',
                    right: 'dayGridDay,dayGridWeek,dayGridMonth listWeek,listMonth resourceTimeGridDay,resourceTimeGridWeek resourceTimeline,resourceTimelineWorkWeek',
                }}
                views={{
                    listWeek: { buttonText: 'Liste semaine' },
                    listMonth: { buttonText: 'Liste mois' },
                    resourceTimeGridDay: { buttonText: 'Jour vertical' },
                    resourceTimeGridWeek: {
                        type: 'resourceTimeGrid',
                        duration: { week: 1 },
                        buttonText: 'Semaine verticale',
                    },
                    resourceTimeline: { buttonText: 'Jour timeline' },
                    resourceTimelineWorkWeek: {
                        type: 'resourceTimeline',
                        duration: { week: 1 },
                        buttonText: 'Semaine timeline',
                    },
                }}
                plugins={[
                    dayGridPlugin,
                    listPlugin,
                    resourceTimelinePlugin,
                    resourceTimeGridPlugin,
                    adaptivePlugin,
                    luxon2Plugin,
                ]}
                eventClick={eventClick}
                eventContent={eventContent}
                businessHours={{
                    startTime: '08:30',
                    endTime: '17:00',
                }}
                slotMinTime="07:00"
                slotMaxTime="22:00"
            />
            {selectedEvent && (
                <Offcanvas
                    show={selectedEvent !== null}
                    onHide={() => setSelectedEvent(null)}
                    backdropClassName="offcanvas-backdrop"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title as="h4">{selectedEvent.title}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Event selectedEvent={selectedEvent} />
                    </Offcanvas.Body>
                </Offcanvas>
            )}
            {/* {selectedEvent && (
                <Modal show={selectedEvent !== null} onHide={() => setSelectedEvent(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title as="h4">{selectedEvent.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Event selectedEvent={selectedEvent} />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )} */}
        </>
    )
}
