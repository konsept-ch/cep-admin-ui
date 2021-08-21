import { useHistory, useLocation } from 'react-router-dom'
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faDollar,
    faFileSignature,
    faChartLineUp,
    faGear,
    faSitemap,
    faFileInvoiceDollar,
    faUserCheck,
    faGraduationCap,
    faCalendarDays,
} from '@fortawesome/pro-light-svg-icons'

export const Navigation = () => {
    const history = useHistory()
    const location = useLocation()

    const goTo = (to) => (event) => {
        event.preventDefault()
        history.push(to)
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/" onClick={goTo('/')}>
                    CEP - Gestionnaire
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" activeKey={location.pathname}>
                        <Nav.Link href="/agenda" onClick={goTo('/agenda')}>
                            <FontAwesomeIcon icon={faCalendarDays} /> Agenda
                        </Nav.Link>
                        <Nav.Link href="/inscriptions" onClick={goTo('/inscriptions')}>
                            <FontAwesomeIcon icon={faUserCheck} /> Inscriptions
                        </Nav.Link>
                        <Nav.Link>
                            <FontAwesomeIcon icon={faFileSignature} /> Contrats
                        </Nav.Link>
                        <NavDropdown
                            title={
                                <>
                                    <FontAwesomeIcon icon={faDollar} /> Finances
                                </>
                            }
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item>
                                <FontAwesomeIcon icon={faFileInvoiceDollar} /> Factures
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <FontAwesomeIcon icon={faSitemap} /> Clients
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <FontAwesomeIcon icon={faGraduationCap} /> Formations
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link>
                            <FontAwesomeIcon icon={faChartLineUp} /> Statistiques
                        </Nav.Link>
                        <Nav.Link>
                            <FontAwesomeIcon icon={faGear} /> Paramètres
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
