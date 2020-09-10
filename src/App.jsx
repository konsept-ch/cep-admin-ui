import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules'

import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Button, Nav, NavLink } from 'reactstrap'

import { GeneralGrid, SurveyPage } from './components'
import { loadFromClaroline } from './server'

ModuleRegistry.registerModules(AllModules)

class App extends Component {
    render() {
        return (
            <Router>
                <Helmet>
                    <title>Survey data</title>
                </Helmet>
                <div className="header mb-3 py-3">
                    <Nav className="menu">
                        <NavLink className="link" href="/">
                            Data Grid
                        </NavLink>
                        <NavLink className="link" href="/survey">
                            Survey Grid
                        </NavLink>
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
                <Button className="mx-auto d-block" onClick={loadFromClaroline}>
                    Load from Claroline
                </Button>
            </Router>
        )
    }
}

export default App
