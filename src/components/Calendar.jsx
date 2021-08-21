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
                locale={frLocale}
                resources={resources}
                events={events}
                resourceAreaHeaderContent="Salles"
                height="65vh"
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                themeSystem="bootstrap"
                initialView="resourceTimeGridDay"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay,workDays,resourceTimeGridDay,resourceTimeline',
                }}
                eventClick={function (info) {
                    info.jsEvent.preventDefault()
                    setSelectedEvent({ ...info.event._def, range: info.event._instance.range })
                }}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    resourceTimelinePlugin,
                    resourceTimeGridPlugin,
                    adaptivePlugin,
                ]}
                views={{
                    workDays: {
                        type: 'timeGrid',
                        duration: { days: 5 },
                        buttonText: '5 jours',
                    },
                    resourceTimeGridDay: {
                        buttonText: 'Jour vertical',
                    },
                }}
                eventContent={(eventInfo) => (
                    <>
                        {eventInfo.timeText && (
                            <>
                                <b>{eventInfo.timeText}</b>
                                <br />
                            </>
                        )}
                        <i>{eventInfo.event.title}</i>
                    </>
                )}
            />
            {selectedEvent && (
                <Offcanvas
                    show={selectedEvent !== null}
                    onHide={() => setSelectedEvent(null)}
                    backdropClassName="offcanvas-backdrop"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{selectedEvent.title}</Offcanvas.Title>
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

Calendar.displayName = 'Calendar'
