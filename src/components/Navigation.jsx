import { useNavigate, useLocation } from 'react-router-dom'
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faList,
    faDisplay,
    faGraduationCap,
    faCalendarDays,
    faCalendarCheck,
    faCertificate,
    faFileContract,
    faChalkboardUser,
    faUsers,
    faBook,
    faDna,
    faBan,
    faBookOpen,
    faUserSlash,
    faArrowRightFromBracket,
    faEnvelopeOpenText,
} from '@fortawesome/free-solid-svg-icons'

import {
    PATH_AGENDA,
    PATH_INSCRIPTIONS,
    PATH_FORMATEURS,
    PATH_CATALOGUE,
    PATH_FORMATIONS,
    PATH_SESSIONS,
    PATH_TEMPLATES,
    PATH_EMAIL_TEMPLATES,
    PATH_ATTESTATION_TEMPLATES,
    PATH_CONTRACTS,
    PATH_EVALUATIONS,
    PATH_COMMUNITY,
    PATH_USERS,
    PATH_ORGANIZATIONS,
    PATH_ANNULATIONS,
    PATH_SEANCES,
    PATH_REFUSED_BY_HR,
} from '../constants/constants'
import { clearAllAuthCookies } from '../utils'
import { currentRunningEnv } from '../constants/config'

export const Navigation = ({ isLoggedIn }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const goTo = (to) => (event) => {
        event.preventDefault()
        navigate(to)
    }

    return (
        <Navbar bg="light" expand="xl" className={`is-running-in-${currentRunningEnv}`}>
            <Container fluid>
                <Navbar.Brand href="/" onClick={goTo('/')}>
                    CEP - Former22 ({`${currentRunningEnv[0].toUpperCase()}${currentRunningEnv.slice(1)}`})
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
                                    <FontAwesomeIcon icon={faCalendarCheck} /> Inscriptions
                                </>
                            }
                        >
                            <Nav.Link
                                href={`/${PATH_INSCRIPTIONS}/${PATH_INSCRIPTIONS}`}
                                onClick={goTo(`${PATH_INSCRIPTIONS}/${PATH_INSCRIPTIONS}`)}
                            >
                                <FontAwesomeIcon icon={faCalendarCheck} /> Participants
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_INSCRIPTIONS}/${PATH_FORMATEURS}`}
                                onClick={goTo(`${PATH_INSCRIPTIONS}/${PATH_FORMATEURS}`)}
                            >
                                <FontAwesomeIcon icon={faChalkboardUser} /> Formateurs
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_INSCRIPTIONS}/${PATH_ANNULATIONS}`}
                                onClick={goTo(`${PATH_INSCRIPTIONS}/${PATH_ANNULATIONS}`)}
                            >
                                <FontAwesomeIcon icon={faBan} /> Annulations
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_INSCRIPTIONS}/${PATH_REFUSED_BY_HR}`}
                                onClick={goTo(`${PATH_INSCRIPTIONS}/${PATH_REFUSED_BY_HR}`)}
                            >
                                <FontAwesomeIcon icon={faUserSlash} /> Refusée par RH
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
                                <FontAwesomeIcon icon={faDisplay} /> Sessions
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_CATALOGUE}/${PATH_SEANCES}`}
                                onClick={goTo(`${PATH_CATALOGUE}/${PATH_SEANCES}`)}
                            >
                                <FontAwesomeIcon icon={faBookOpen} /> Séances
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_CATALOGUE}/${PATH_CONTRACTS}`}
                                onClick={goTo(`${PATH_CATALOGUE}/${PATH_CONTRACTS}`)}
                            >
                                <FontAwesomeIcon icon={faFileContract} /> Contrats
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_CATALOGUE}/${PATH_EVALUATIONS}`}
                                onClick={goTo(`${PATH_CATALOGUE}/${PATH_EVALUATIONS}`)}
                            >
                                <FontAwesomeIcon icon={faDna} /> Évaluations
                            </Nav.Link>
                        </NavDropdown>
                        {/* <Nav.Link href={`/${PATH_TEMPLATES}`} onClick={goTo(PATH_TEMPLATES)}>
                            <FontAwesomeIcon icon={faEnvelopeOpenText} /> Modèles
                        </Nav.Link> */}
                        <NavDropdown
                            active={location.pathname.startsWith(`/${PATH_TEMPLATES}`)}
                            title={
                                <>
                                    <FontAwesomeIcon icon={faEnvelopeOpenText} /> Modèles
                                </>
                            }
                        >
                            <Nav.Link
                                href={`/${PATH_TEMPLATES}/${PATH_EMAIL_TEMPLATES}`}
                                onClick={goTo(`${PATH_TEMPLATES}/${PATH_EMAIL_TEMPLATES}`)}
                            >
                                <FontAwesomeIcon icon={faEnvelopeOpenText} /> E-mails
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_TEMPLATES}/${PATH_ATTESTATION_TEMPLATES}`}
                                onClick={goTo(`${PATH_TEMPLATES}/${PATH_ATTESTATION_TEMPLATES}`)}
                            >
                                <FontAwesomeIcon icon={faCertificate} /> Attestations
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_TEMPLATES}/${PATH_CONTRACTS}`}
                                onClick={goTo(`${PATH_TEMPLATES}/${PATH_CONTRACTS}`)}
                            >
                                <FontAwesomeIcon icon={faFileContract} /> Contrats
                            </Nav.Link>
                            <Nav.Link
                                href={`/${PATH_TEMPLATES}/${PATH_EVALUATIONS}`}
                                onClick={goTo(`${PATH_TEMPLATES}/${PATH_EVALUATIONS}`)}
                            >
                                <FontAwesomeIcon icon={faDna} /> Évaluations
                            </Nav.Link>
                        </NavDropdown>
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
                                <FontAwesomeIcon icon={faList} /> Organisations
                            </Nav.Link>
                        </NavDropdown>
                    </Nav>
                    {isLoggedIn && (
                        <Nav>
                            <Nav.Link
                                href="/"
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
