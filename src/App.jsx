import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./App.scss";

import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { GeneralGrid, SurveyGrid } from "./components";
import { ModuleRegistry, AllModules } from "@ag-grid-enterprise/all-modules";

ModuleRegistry.registerModules(AllModules);

class App extends Component {
  render() {
    return (
      <Router>
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
        </div>
      </Router>
    );
  }
}

export default App;
