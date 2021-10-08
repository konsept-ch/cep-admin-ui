import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import { InscriptionsPage } from './pages/InscriptionsPage'
import { SurveyPage } from './pages/SurveyPage'
import { SessionsPage } from './pages/SessionsPage'
import { CoursesPage } from './pages/CoursesPage'
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
} from './constants/constants'
import { fetchParametersAction } from './actions/parameters'
import { ErrorBoundary } from './pages/ErrorBoundaryPage'

export function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchParametersAction())
    }, [])

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>CEP - Former22</title>
                </Helmet>
                <Navigation />
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
