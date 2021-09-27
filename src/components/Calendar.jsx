import { useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import frLocale from '@fullcalendar/core/locales/fr'
import adaptivePlugin from '@fullcalendar/adaptive'

import { Event } from './Event'

export const Calendar = ({ resources, events }) => {
    const [selectedEvent, setSelectedEvent] = useState(null)

    return (
        <div className="mb-3">
            <FullCalendar
                nowIndicator
                editable
                navLinks
                aspectRatio={3}
                allDaySlot={false}
                locale={frLocale}
                resources={resources.map((resource) => ({ ...resource, title: resource.name }))}
                events={events.map((event) => ({ ...event, title: event.name, resourceId: event.room.id }))}
                resourceOrder="title"
                resourceAreaHeaderContent="Salles"
                height="calc(100vh - 200px)"
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                initialView="dayGridWeek" // TODO order by salle ?
                headerToolbar={{
                    left: 'today prev,next',
                    center: 'title',
                    right: 'dayGridDay,dayGridWeek,dayGridMonth listWeek resourceTimeGridDay,resourceTimeGridWeek resourceTimeline,resourceTimelineWorkWeek',
                }}
                views={{
                    listWeek: {
                        buttonText: 'Liste',
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
                plugins={[dayGridPlugin, listPlugin, resourceTimelinePlugin, resourceTimeGridPlugin, adaptivePlugin]}
                eventClick={(info) => {
                    info.jsEvent.preventDefault()
                    setSelectedEvent({ ...info.event._def, range: info.event._instance.range })
                }}
                eventContent={(eventInfo) => (
                    <>
                        <b>
                            <span className="event-content-room">{eventInfo.event._def.extendedProps.room.name}</span> |{' '}
                            {eventInfo.timeText}
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
        </div>
    )
}
