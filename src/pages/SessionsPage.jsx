import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, InputGroup, FormControl, Button, Col } from 'react-bootstrap'

import { fetchSessionsAction } from '../actions/sessions.ts'
import { sessionsSelector } from '../reducers'

import { Grid } from '../components'
// import { callService } from '../utils'

export function SessionsPage() {
    const dispatch = useDispatch()
    const sessions = useSelector(sessionsSelector)
    const rowData = null

    console.log(sessions)

    useEffect(() => {
        dispatch(fetchSessionsAction())
    }, [])

    const columnDefs = [
        {
            headerName: 'Participant',
            field: 'participant',
        },
        {
            headerName: 'Fonction/Profession',
            field: 'profession',
        },
        {
            headerName: 'Session',
            field: 'session',
        },
        {
            headerName: 'Statut',
            field: 'status',
        },
        {
            headerName: 'Date de début',
            field: 'startDate',
        },
    ]

    return (
        <Container fluid>
            <h1 className="mt-3">Sessions</h1>
            <Col md="6">
                <InputGroup className="mb-4">
                    <FormControl
                        placeholder="participant/formation/statut/date/... "
                        aria-label="participant/formation/statut/date/... "
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="primary" id="button-addon2">
                        Rechercher
                    </Button>
                </InputGroup>
            </Col>
            <Grid columnDefs={columnDefs} rowData={rowData} />
        </Container>
    )
}
