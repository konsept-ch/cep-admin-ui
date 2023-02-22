import { useState, useMemo } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { useGetEvaluationQuery } from '../services/evaluations'

export function EvaluationPage() {
    const params = useParams()

    const [result, setResult] = useState({})

    const { data: evaluation, isFetching: isFetchingEvaluation, isError } = useGetEvaluationQuery(params.uuid)

    return (
        <>
            <Helmet>
                <title>Evaluation - Former22</title>
            </Helmet>
            <Container fluid>
                {isFetchingEvaluation || isError ? (
                    <div className="d-flex justify-content-center align-items-center h-vh">
                        <div className="d-flex flex-column align-items-center">
                            {isError ? (
                                <h4>Cette évaluation n'est pas ou plus accessible</h4>
                            ) : (
                                <>
                                    <Spinner animation="grow" size="lg" className="mb-4" />
                                    <h4>Chargement</h4>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <h1>{evaluation.sessionName}</h1>
                )}
            </Container>
        </>
    )
}
