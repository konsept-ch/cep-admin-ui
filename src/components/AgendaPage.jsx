import React, { useState } from 'react'
import { Container, Offcanvas } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import { agendaEvents } from '../mock/agenda-events' // a plugin!

export const AgendaPage = React.memo(() => {
    const [selectedEvent, setSelectedEvent] = useState(null)

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
    }

    return (
        <Container fluid className="my-3">
            <FullCalendar
                eventClick={function (info) {
                    info.jsEvent.preventDefault()
                    setSelectedEvent({ ...info.event._def, range: info.event._instance.range })
                }}
                height="65vh"
                plugins={[dayGridPlugin, timeGridPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay,timeGridFourDay',
                }}
                views={{
                    timeGridFourDay: {
                        type: 'timeGrid',
                        duration: { days: 4 },
                        buttonText: '4 day',
                    },
                }}
                timeZone="UTC"
                initialView="timeGridWeek"
                events={agendaEvents}
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
                            <dt>Desctiprion</dt>
                            <dd>{selectedEvent.extendedProps.description}</dd>

                            <dt>Room</dt>
                            <dd>{selectedEvent.extendedProps.room}</dd>

                            <dt>Time</dt>
                            <dd className="pl-3">
                                <b>Start</b> -{' '}
                                {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.start)}
                                <br />
                                <b>End</b> - {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.end)}
                            </dd>
                        </dl>
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </Container>
    )
})

AgendaPage.displayName = 'AgendaPage'
