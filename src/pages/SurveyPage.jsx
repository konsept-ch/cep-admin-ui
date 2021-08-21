import { Link, Switch, Route, useLocation } from 'react-router-dom'
import { ResultsPage } from './ResultsPage'

export function SurveyPage() {
    const location = useLocation()

    return (
        <div className="page mx-auto">
            <h2>Facturation</h2>
            {location.pathname.includes('results') ? (
                <Switch>
                    <Route path="/survey/:results">
                        <ResultsPage />
                    </Route>
                </Switch>
            ) : (
                <Link to={`${location.pathname}/results`} className="link">
                    Résultats
                </Link>
            )}
        </div>
    )
}
