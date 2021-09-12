import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container, InputGroup, FormControl, Button, Col } from 'react-bootstrap'
import { dataSelector } from '../reducers/data'
import { Grid } from '../components'

export function SessionsPage() {
    const rowData = useSelector(dataSelector)

    useEffect(() => {
        const fetchRooms = async () => {
            const sessionsResponse = await fetch('http://localhost:4000/sessions')
            const sessions = await sessionsResponse.json()

            console.log('🚀 ~ file: SessionsPage.jsx ~ line 15 ~ fetchRooms ~ sessions', sessions)
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