import React, { useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import frLocale from '@fullcalendar/core/locales/fr'
import adaptivePlugin from '@fullcalendar/adaptive'

export const Calendar = ({ resources, events }) => {
    const [selectedEvent, setSelectedEvent] = useState(null)

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
    }

    return (
        <div className="mb-3">
            <FullCalendar
                nowIndicator
                editable
                aspectRatio={3}
                weekends={false}
                locale={frLocale}
                resources={resources}
                events={events}
                resourceOrder="title"
                resourceAreaHeaderContent="Salles"
                height="calc(100vh - 160px)"
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                themeSystem="bootstrap"
                initialView="resourceTimeGridDay"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridDay,dayGridWeek,dayGridMonth timeGridDay,timeGridWeek resourceTimeGridDay,resourceTimeGridWeek resourceTimeline,resourceTimelineWorkWeek',
                }}
                views={{
                    timeGridDay: {
                        buttonText: 'Jour (heures)',
                    },
                    timeGridWeek: {
                        buttonText: 'Semaine (heures)',
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
                    timeGridPlugin,
                    resourceTimelinePlugin,
                    resourceTimeGridPlugin,
                    adaptivePlugin,
                ]}
                eventClick={function (info) {
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
                    startTime: '08:00',
                    endTime: '18:00',
                }}
                slotMinTime="07:00"
                slotMaxTime="19:00"
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
                        <dl>
                            <dt>Description</dt>
                            <dd>{selectedEvent.extendedProps.description}</dd>

                            <dt>Salle</dt>
                            <dd>{selectedEvent.extendedProps.room.name}</dd>

                            <dt>Temps</dt>
                            <dd className="pl-3">
                                <b>Début</b> -
                                {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.start)}
                                <br />
                                <b>Fin</b> - {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.end)}
                            </dd>
                        </dl>
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </div>
    )
}
