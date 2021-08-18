import { useDispatch } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { Button, Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
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
import { InscriptionsPage, SurveyPage, AgendaPage } from './components'
import { getDataAction } from './actions/data'

export function App() {
    const dispatch = useDispatch()

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <HelmetProvider>
                <Helmet>
                    <title>CEP - Gestionnaire</title>
                </Helmet>
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand>CEP - Gestionnaire</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/agenda">
                                    <FontAwesomeIcon icon={faCalendarDays} /> Agenda
                                </Nav.Link>
                                <Nav.Link>
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
                {/* <div className="header mb-3 py-3">
                    <Nav className="menu">
                        <Link className="link" to="/">
                            Data Grid
                        </Link>
                        <Link className="link" to="/survey">
                            Facturation Grid
                        </Link>
                    </Nav>
                </div> */}
                <Switch>
                    <Route exact path="/">
                        <InscriptionsPage />
                    </Route>
                    <Route exact path="/agenda">
                        <AgendaPage />
                    </Route>
                    <Route path="/survey/">
                        <SurveyPage />
                    </Route>
                </Switch>
                <Button variant="primary" className="mx-auto d-block" onClick={() => dispatch(getDataAction())}>
                    API Claroline
                </Button>
            </HelmetProvider>
        </BrowserRouter>
    )
}
