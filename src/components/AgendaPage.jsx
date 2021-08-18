import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import { agendaEvents } from '../mock/agenda-events' // a plugin!

export function AgendaPage() {
    return (
        <FullCalendar
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
    )
}
