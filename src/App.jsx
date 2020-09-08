import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { ModuleRegistry, AllModules } from "@ag-grid-enterprise/all-modules";

import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./App.scss";
import { GeneralGrid, SurveyGrid } from "./components";
import { loadFromClaroline } from "./server";

ModuleRegistry.registerModules(AllModules);

class App extends Component {
  render() {
    return (
      <Router>
        <Helmet>
          <title>Survey data</title>
        </Helmet>
        <div>
          <div className="header">
            <ul className="menu">
              <li>
                <Link to="/">General grid</Link>
              </li>
              <li>
                <Link to="/survey">Survey grid</Link>
              </li>
            </ul>
          </div>
          <Switch>
            <Route exact path="/">
              <GeneralGrid />
            </Route>
            <Route path="/survey">
              <SurveyGrid />
            </Route>
          </Switch>
          <button onClick={loadFromClaroline}>Load from Claroline</button>
        </div>
      </Router>
    );
  }
}

export default App;
