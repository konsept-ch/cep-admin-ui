import { Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import { Container } from 'react-bootstrap'

import { InscriptionsPage } from './pages/InscriptionsPage'
import { SurveyPage } from './pages/SurveyPage'
import { SessionsPage } from './pages/SessionsPage'
import { CoursesPage } from './pages/CoursesPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { AgendaPage } from './pages/AgendaPage'
import { TypographyPage } from './pages/TypographyPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { Navigation } from './components'
import { Footer } from './components/Footer'
import {
    PATH_INSCRIPTIONS,
    PATH_SESSIONS,
    PATH_AGENDA,
    PATH_NOTIFICATIONS,
    PATH_FORMATIONS,
    PATH_TEMPLATES,
    PATH_ORGANIZATIONS,
} from './constants/constants'
import { ErrorBoundary } from './pages/ErrorBoundaryPage'
import { OrganizationsPage } from './pages/OrganizationsPage'

export function App() {
    return (
        <>
            <ToastContainer />
            <Navigation />
            <HelmetProvider>
                <Helmet>
                    <title>CEP - Former22</title>
                </Helmet>
                <ErrorBoundary>
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={
                                <Container fluid>
                                    <h1>Dashboard (en construction)</h1>
                                    <p>Notifications et alertes à venir</p>
                                </Container>
                            }
                        />
                        <Route exact path={PATH_AGENDA} element={<AgendaPage />} />
                        <Route exact path={PATH_INSCRIPTIONS} element={<InscriptionsPage />} />
                        <Route exact path={PATH_SESSIONS} element={<SessionsPage />} />
                        <Route exact path={PATH_FORMATIONS} element={<CoursesPage />} />
                        <Route exact path={PATH_TEMPLATES} element={<TemplatesPage />} />
                        <Route exact path={PATH_ORGANIZATIONS} element={<OrganizationsPage />} />
                        <Route exact path={PATH_NOTIFICATIONS} element={<NotificationsPage />} />
                        <Route path="/survey/" element={<SurveyPage />} />
                        <Route path="/typography" element={<TypographyPage />} />
                    </Routes>
                </ErrorBoundary>
            </HelmetProvider>
            <Footer />
        </>
    )
}
