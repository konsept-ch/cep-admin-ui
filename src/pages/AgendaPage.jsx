import React, { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { Calendar } from '../components'
import { timelineResources } from '../mock/agenda-events'

export const AgendaPage = React.memo(() => {
    const [selectedRooms, setSelectedRooms] = useState(
        timelineResources.reduce((allRooms, { id }) => ({ ...allRooms, [id]: true }), {})
    )

    return (
        <Container fluid className="my-3">
            <Calendar resources={timelineResources.filter(({ id }) => selectedRooms[id])} />
            {timelineResources.map(({ title, id }) => (
                <Form.Check
                    inline
                    type="checkbox"
                    checked={selectedRooms[id]}
                    id={id}
                    label={title}
                    onChange={({ target }) => setSelectedRooms({ ...selectedRooms, [id]: target.checked })}
                />
            ))}
        </Container>
    )
})

AgendaPage.displayName = 'AgendaPage'
