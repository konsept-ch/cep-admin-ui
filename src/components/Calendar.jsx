import { useState, useMemo, useCallback } from 'react'
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

import { DATE_FORMAT_OPTIONS, DATE_FORMAT_SWISS_FRENCH } from '../constants/constants'
import { Event } from './Event'

export const Calendar = ({ resources, events, calendarRef, refreshCallback, loading }) => {
    const [selectedEvent, setSelectedEvent] = useState(null)

    const customButtons = useMemo(
        () => ({
            refresh: {
                text: '↺',
                click: refreshCallback,
                hint: 'Rafraîchir données de Claroline',
            },
        }),
        [loading, refreshCallback]
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
                eventOrder={eventOrder}
                resources={resources}
                events={events}
                resourceAreaHeaderContent="Salles"
                height="100%"
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                initialView="dayGridWeek"
                customButtons={customButtons}
                headerToolbar={{
                    left: 'today prev,next refresh',
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
        </>
    )
}
