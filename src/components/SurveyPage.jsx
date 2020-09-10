import React from 'react'
import { Link, Switch, Route, useLocation } from 'react-router-dom'
import { ResultsPage } from './'

function SurveyPage() {
    const location = useLocation()

    return (
        <div className="page mx-auto">
            <h2>Welcome to the survey page</h2>
            {location.pathname.includes('results') ? (
                <Switch>
                    <Route path="/survey/:results">
                        <ResultsPage />
                    </Route>
                </Switch>
            ) : (
                <Link to={`${location.pathname}/results`} className="link">
                    Results
                </Link>
            )}
        </div>
    )
}

export default SurveyPage
