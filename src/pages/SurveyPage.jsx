import { Helmet } from 'react-helmet-async'
import { Link, Routes, Route, useLocation } from 'react-router-dom'

import { ResultsPage } from './ResultsPage'

export function SurveyPage() {
    const location = useLocation()

    return (
        <>
            <Helmet>
                <title>Survey - Former22</title>
            </Helmet>
            <div className="page mx-auto">
                <h2>Facturation</h2>
                {location.pathname.includes('results') ? (
                    <Routes>
                        <Route path="/survey/:results">
                            <ResultsPage />
                        </Route>
                    </Routes>
                ) : (
                    <Link to={`${location.pathname}/results`} className="link">
                        Résultats
                    </Link>
                )}
            </div>
        </>
    )
}
