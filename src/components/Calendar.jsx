import { useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import frLocale from '@fullcalendar/core/locales/fr'
import adaptivePlugin from '@fullcalendar/adaptive'
import { DATE_FORMAT_SWISS_FRENCH } from '../constants/constants'

import { Event } from './Event'

export const Calendar = ({ resources, events, calendarRef }) => {
    const [selectedEvent, setSelectedEvent] = useState(null)

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
                resources={resources.map((resource) => ({ ...resource, title: resource.name }))}
                events={events.map((event) => ({ ...event, title: event.name, resourceId: event.room.id }))}
                timeZone="America/New_York"
                resourceOrder="title"
                resourceAreaHeaderContent="Salles"
                height="100%"
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                initialView="dayGridWeek" // TODO order by salle ?
                headerToolbar={{
                    left: 'today prev,next',
                    center: 'title',
                    right: 'dayGridDay,dayGridWeek,dayGridMonth listWeek,listMonth resourceTimeGridDay,resourceTimeGridWeek resourceTimeline,resourceTimelineWorkWeek',
                }}
                views={{
                    listWeek: {
                        buttonText: 'Liste semaine',
                    },
                    listMonth: {
                        buttonText: 'Liste mois',
                    },
                    resourceTimeGridDay: {
                        buttonText: 'Jour vertical',
                    },
                    resourceTimeGridWeek: {
                        type: 'resourceTimeGrid',
                        duration: { week: 1 },
                        buttonText: 'Semaine verticale',
                    },
                    resourceTimeline: {
                        buttonText: 'Jour timeline',
                    },
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
                    momentTimezonePlugin,
                ]}
                eventClick={(info) => {
                    info.jsEvent.preventDefault()
                    setSelectedEvent({ ...info.event._def, range: info.event._instance.range })
                }}
                eventContent={(eventInfo) => (
                    <>
                        <b>
                            <span className="event-content-room">{eventInfo.event._def.extendedProps.room.name}</span>|
                            {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, {
                                hour: 'numeric',
                                minute: 'numeric',
                            }).format(new Date(eventInfo.event._instance.range.start))}
                        </b>
                        <br />
                        <i>{eventInfo.event.title}</i>
                    </>
                )}
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
