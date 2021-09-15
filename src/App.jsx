import { Switch, Route, Redirect } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import { InscriptionsPage } from './pages/InscriptionsPage'
import { SurveyPage } from './pages/SurveyPage'
import { SessionsPage } from './pages/SessionsPage'
import { AgendaPage } from './pages/AgendaPage'
import { TypographyPage } from './pages/TypographyPage'
import { Navigation } from './components'
import { PATH_INSCRIPTIONS, PATH_SESSIONS } from './constants/constants'

export function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <title>CEP - Former22</title>
            </Helmet>
            <Navigation />
            <Switch>
                <Redirect exact from="/" to={PATH_INSCRIPTIONS} />
                <Route exact path="/agenda">
                    <AgendaPage />
                </Route>
                <Route exact path={PATH_INSCRIPTIONS}>
                    <InscriptionsPage />
                </Route>
                <Route exact path={PATH_SESSIONS}>
                    <SessionsPage />
                </Route>
                <Route path="/survey/">
                    <SurveyPage />
                </Route>
                <Route path="/typography">
                    <TypographyPage />
                </Route>
            </Switch>
        </HelmetProvider>
    )
}
