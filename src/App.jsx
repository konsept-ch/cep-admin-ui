import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'

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
import { fetchParametersAction } from './actions/parameters'
import { fetchSessionsAction } from './actions/sessions'
import { ErrorBoundary } from './pages/ErrorBoundaryPage'
import { OrganizationsPage } from './pages/OrganizationsPage'

export function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchParametersAction())
        dispatch(fetchSessionsAction())
    }, [])

    return (
        <>
            <ToastContainer />
            <Navigation />
            <HelmetProvider>
                <Helmet>
                    <title>CEP - Former22</title>
                </Helmet>
                <ErrorBoundary>
                    <Switch>
                        <Redirect exact from="/" to={PATH_INSCRIPTIONS} />
                        <Route exact path={PATH_AGENDA}>
                            <AgendaPage />
                        </Route>
                        <Route exact path={PATH_INSCRIPTIONS}>
                            <InscriptionsPage />
                        </Route>
                        <Route exact path={PATH_SESSIONS}>
                            <SessionsPage />
                        </Route>
                        <Route exact path={PATH_FORMATIONS}>
                            <CoursesPage />
                        </Route>
                        <Route exact path={PATH_TEMPLATES}>
                            <TemplatesPage />
                        </Route>
                        <Route exact path={PATH_ORGANIZATIONS}>
                            <OrganizationsPage />
                        </Route>
                        <Route exact path={PATH_NOTIFICATIONS}>
                            <NotificationsPage />
                        </Route>
                        <Route path="/survey/">
                            <SurveyPage />
                        </Route>
                        <Route path="/typography">
                            <TypographyPage />
                        </Route>
                    </Switch>
                </ErrorBoundary>
            </HelmetProvider>
            <Footer />
        </>
    )
}
