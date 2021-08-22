import { useEffect, useState } from 'react'
import { Container, InputGroup, FormControl, Button, Col } from 'react-bootstrap'
import { Grid } from '../components'
import { transformFlagsToStatus } from '../utils'

export function InscriptionsPage() {
    const [inscriptions, setInscriptions] = useState([])

    useEffect(() => {
        const fetchInscriptions = async () => {
            const inscriptionsResponse = await fetch('http://localhost:4000/inscriptions')
            setInscriptions(await inscriptionsResponse.json())
        }

        fetchInscriptions()
    }, [])

    const columnDefs = [
        { field: 'participant', headerName: 'Participant' },
        { field: 'profession', headerName: 'Fonction/Profession' },
        { field: 'session', headerName: 'Session' },
        { field: 'status', headerName: 'Statut' },
        { field: 'startDate', headerName: 'Date de début' },
    ]

    console.log('inscriptions', inscriptions)

    const rowData = inscriptions.map(({ user, session, validated, confirmed, date }) => ({
        participant: user.name,
        profession: 'To-Do',
        session: session.name,
        status: transformFlagsToStatus({ validated, confirmed }),
        startDate: date,
    }))

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
