import { useEffect } from 'react'
import { Container, InputGroup, FormControl, Button, Col } from 'react-bootstrap'

import { Grid } from '../components'
// import { callService } from '../utils'

export function SessionsPage() {
    const rowData = null

    useEffect(() => {
        const fetchRooms = async () => {
            // const sessionsResponse = await callService('sessions')
            // const sessions = await sessionsResponse
        }

        fetchRooms()
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
            <h1 className="mt-3">Inscriptions</h1>
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
