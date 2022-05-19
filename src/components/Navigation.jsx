import { useNavigate, useLocation } from 'react-router-dom'
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faListTree,
    faPresentationScreen,
    faGraduationCap,
    faCalendarDays,
    faCalendarStar,
    faArrowRightFromBracket,
    faEnvelopeOpenText,
    faChalkboardTeacher,
    faUsers,
    faBook,
    faFileInvoiceDollar,
} from '@fortawesome/pro-light-svg-icons'
import {
    PATH_AGENDA,
    PATH_INSCRIPTIONS,
    PATH_FORMATEURS,
    PATH_CATALOGUE,
    PATH_FORMATIONS,
    PATH_SESSIONS,
    PATH_TEMPLATES,
    PATH_COMMUNITY,
    PATH_USERS,
    PATH_ORGANIZATIONS,
    PATH_INVOICE,
} from '../constants/constants'
import { clearAllAuthCookies } from '../utils'

export const Navigation = ({ isLoggedIn }) => {
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
                        <Nav.Link href={`/${PATH_AGENDA}`} onClick={goTo(PATH_AGENDA)}>
                            <FontAwesomeIcon icon={faCalendarDays} /> Agenda
                        </Nav.Link>
                        <NavDropdown
                            active={location.pathname.startsWith(`/${PATH_INSCRIPTIONS}`)}
                            title={
                                <>
                                    <FontAwesomeIcon icon={faCalendarStar} /> Inscriptions
                                </>
                            }
                        >
                            <Nav.Link
                                href={`/${PATH_INSCRIPTIONS}/${PATH_INSCRIPTIONS}`}
                                onClick={goTo(`${PATH_INSCRIPTIONS}/${PATH_INSCRIPTIONS}`)}
                            >
                                <FontAwesomeIcon icon={faCalendarStar} /> Participants
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_INSCRIPTIONS}/${PATH_FORMATEURS}`}
                                onClick={goTo(`${PATH_INSCRIPTIONS}/${PATH_FORMATEURS}`)}
                            >
                                <FontAwesomeIcon icon={faChalkboardTeacher} /> Formateurs
                            </Nav.Link>
                        </NavDropdown>
                        <NavDropdown
                            active={location.pathname.startsWith(`/${PATH_CATALOGUE}`)}
                            title={
                                <>
                                    <FontAwesomeIcon icon={faBook} /> Catalogue
                                </>
                            }
                        >
                            <Nav.Link
                                href={`/${PATH_CATALOGUE}/${PATH_FORMATIONS}`}
                                onClick={goTo(`${PATH_CATALOGUE}/${PATH_FORMATIONS}`)}
                            >
                                <FontAwesomeIcon icon={faGraduationCap} /> Formations
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_CATALOGUE}/${PATH_SESSIONS}`}
                                onClick={goTo(`${PATH_CATALOGUE}/${PATH_SESSIONS}`)}
                            >
                                <FontAwesomeIcon icon={faPresentationScreen} /> Sessions
                            </Nav.Link>
                        </NavDropdown>
                        <Nav.Link href={`/${PATH_TEMPLATES}`} onClick={goTo(PATH_TEMPLATES)}>
                            <FontAwesomeIcon icon={faEnvelopeOpenText} /> Modèles
                        </Nav.Link>
                        <Nav.Link href={`/${PATH_INVOICE}`} onClick={goTo(PATH_INVOICE)}>
                            <FontAwesomeIcon icon={faFileInvoiceDollar} /> Factures
                        </Nav.Link>
                        <NavDropdown
                            active={location.pathname.startsWith(`/${PATH_COMMUNITY}`)}
                            title={
                                <>
                                    <FontAwesomeIcon icon={faUsers} /> Communauté
                                </>
                            }
                        >
                            <Nav.Link
                                href={`/${PATH_COMMUNITY}/${PATH_USERS}`}
                                onClick={goTo(`${PATH_COMMUNITY}/${PATH_USERS}`)}
                            >
                                <FontAwesomeIcon icon={faUsers} /> Utilisateurs
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_COMMUNITY}/${PATH_ORGANIZATIONS}`}
                                onClick={goTo(`${PATH_COMMUNITY}/${PATH_ORGANIZATIONS}`)}
                            >
                                <FontAwesomeIcon icon={faListTree} /> Organisations
                            </Nav.Link>
                        </NavDropdown>

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
                    </Nav>
                    {isLoggedIn && (
                        <Nav>
                            <Nav.Link
                                onClick={() => {
                                    clearAllAuthCookies()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: 'red' }} /> Déconnexion
                            </Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
