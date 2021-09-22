import { Switch, Route, Redirect } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import { InscriptionsPage } from './pages/InscriptionsPage'
import { SurveyPage } from './pages/SurveyPage'
import { SessionsPage } from './pages/SessionsPage'
import { AgendaPage } from './pages/AgendaPage'
import { TypographyPage } from './pages/TypographyPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { Navigation } from './components'
import { Footer } from './components/Footer'
import { PATH_INSCRIPTIONS, PATH_SESSIONS, PATH_AGENDA, PATH_NOTIFICATIONS } from './constants/constants'

export function App() {
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>CEP - Former22</title>
                </Helmet>
                <Navigation />
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
            </HelmetProvider>
            <Footer />
        </>
    )
}
