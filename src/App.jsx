import { useDispatch } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { Button, Nav } from 'react-bootstrap'
import { GeneralGrid, SurveyPage } from './components'
import { getDataAction } from './actions/data'

export function App() {
    const dispatch = useDispatch()

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <HelmetProvider>
                <Helmet>
                    <title>Gestion CEP</title>
                </Helmet>
                <div className="header mb-3 py-3">
                    <Nav className="menu">
                        <Link className="link" to="/">
                            Data Grid
                        </Link>
                        <Link className="link" to="/survey">
                            Facturation Grid
                        </Link>
                    </Nav>
                </div>
                <Switch>
                    <Route exact path="/">
                        <GeneralGrid />
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
