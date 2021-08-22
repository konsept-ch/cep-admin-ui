import { Switch, Route, Redirect } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import { InscriptionsPage } from './pages/InscriptionsPage'
import { SurveyPage } from './pages/SurveyPage'
import { AgendaPage } from './pages/AgendaPage'
import { Navigation } from './components'

export function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <title>CEP - Former22</title>
            </Helmet>
            <Navigation />
            <Switch>
                <Redirect exact from="/" to="/inscriptions" />
                <Route exact path="/agenda">
                    <AgendaPage />
                </Route>
                <Route exact path="/inscriptions">
                    <InscriptionsPage />
                </Route>
                <Route path="/survey/">
                    <SurveyPage />
                </Route>
            </Switch>
        </HelmetProvider>
    )
}
