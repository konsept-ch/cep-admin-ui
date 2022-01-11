import { useNavigate, useLocation } from 'react-router-dom'
import { Nav, Navbar, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSitemap,
    faPresentationScreen,
    faGraduationCap,
    faCalendarDays,
    faCalendarStar,
    faMemo,
    faMessage,
    faEnvelopeOpenText,
} from '@fortawesome/pro-light-svg-icons'
import {
    PATH_INSCRIPTIONS,
    PATH_SESSIONS,
    PATH_AGENDA,
    PATH_NOTIFICATIONS,
    PATH_FORMATIONS,
    PATH_TEMPLATES,
    PATH_ORGANIZATIONS,
} from '../constants/constants'

export const Navigation = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const goTo = (to) => (event) => {
        event.preventDefault()
        navigate(to)
    }

    return (
        <Navbar bg="light" expand="xl">
            <Container fluid>
                <Navbar.Brand href="/" onClick={goTo('/')}>
                    CEP - Former22
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" activeKey={location.pathname}>
                        <Nav.Link href={PATH_AGENDA} onClick={goTo(PATH_AGENDA)}>
                            <FontAwesomeIcon icon={faCalendarDays} /> Agenda
                        </Nav.Link>
                        <Nav.Link href={PATH_INSCRIPTIONS} onClick={goTo(PATH_INSCRIPTIONS)}>
                            <FontAwesomeIcon icon={faCalendarStar} /> Inscriptions
                        </Nav.Link>
                        <Nav.Link href={PATH_SESSIONS} onClick={goTo(PATH_SESSIONS)}>
                            <FontAwesomeIcon icon={faPresentationScreen} /> Sessions
                        </Nav.Link>
                        <Nav.Link href={PATH_FORMATIONS} onClick={goTo(PATH_FORMATIONS)}>
                            <FontAwesomeIcon icon={faGraduationCap} /> Formations
                        </Nav.Link>
                        <Nav.Link href={PATH_TEMPLATES} onClick={goTo(PATH_TEMPLATES)}>
                            <FontAwesomeIcon icon={faEnvelopeOpenText} /> Modèles
                        </Nav.Link>
                        <Nav.Link href={PATH_ORGANIZATIONS} onClick={goTo(PATH_ORGANIZATIONS)}>
                            <FontAwesomeIcon icon={faSitemap} /> Organisations
                        </Nav.Link>
                        {/* <NavDropdown
                            title={
                                <>
                                    <FontAwesomeIcon icon={faDollar} /> Finances
                                </>
                            }
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item>
                                <FontAwesomeIcon icon={faFileSignature} /> Contrats
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <FontAwesomeIcon icon={faFileInvoiceDollar} /> Factures
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link>
                            <FontAwesomeIcon icon={faChartLineUp} /> Statistiques
                        </Nav.Link>
                        <Nav.Link>
                            <FontAwesomeIcon icon={faGear} /> Paramètres
                        </Nav.Link> */}
                        <Nav.Link>
                            <FontAwesomeIcon icon={faMemo} /> Logs
                        </Nav.Link>
                    </Nav>
                    <Nav activeKey={location.pathname}>
                        <Nav.Link href={PATH_NOTIFICATIONS} onClick={goTo(PATH_NOTIFICATIONS)}>
                            <FontAwesomeIcon icon={faMessage} /> Notifications
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
