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
    faMemo,
} from '@fortawesome/pro-light-svg-icons'
import { PATH_INSCRIPTIONS, PATH_SESSIONS, PATH_AGENDA } from '../constants/constants'

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
                    CEP - Former22
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" activeKey={location.pathname}>
                        <Nav.Link href="/agenda" onClick={goTo(PATH_AGENDA)}>
                            <FontAwesomeIcon icon={faCalendarDays} /> Agenda
                        </Nav.Link>
                        <NavDropdown
                            title={
                                <>
                                    <FontAwesomeIcon icon={faDollar} /> Statuses
                                </>
                            }
                            active={location.pathname.startsWith('/statuses')}
                        >
                            <NavDropdown.Item eventKey={PATH_INSCRIPTIONS} onClick={goTo(PATH_INSCRIPTIONS)}>
                                <FontAwesomeIcon icon={faUserCheck} /> Inscriptions
                            </NavDropdown.Item>
                            <NavDropdown.Item eventKey={PATH_SESSIONS} onClick={goTo(PATH_SESSIONS)}>
                                <FontAwesomeIcon icon={faUserCheck} /> Sessions
                            </NavDropdown.Item>
                        </NavDropdown>
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
                        <Nav.Link>
                            <FontAwesomeIcon icon={faMemo} /> Logs
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
