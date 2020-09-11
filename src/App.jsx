import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'

import React from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Button, Nav } from 'reactstrap'

import { GeneralGrid, SurveyPage } from './components'
import { getDataAction } from './actions/data'

function App() {
    const dispatch = useDispatch()

    return (
        <Router>
            <Helmet>
                <title>Survey data</title>
            </Helmet>
            <div className="header mb-3 py-3">
                <Nav className="menu">
                    <Link className="link" to="/">
                        Data Grid
                    </Link>
                    <Link className="link" to="/survey">
                        Survey Grid
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
            <Button className="mx-auto d-block" onClick={() => dispatch(getDataAction())}>
                Load from Claroline
            </Button>
        </Router>
    )
}

export default App
