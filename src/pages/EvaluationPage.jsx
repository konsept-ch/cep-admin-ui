import { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { Block } from '../components'

import { useGetEvaluationQuery, useCreateEvaluationResultMutation } from '../services/evaluations'
import { toast } from 'react-toastify'

export function EvaluationPage() {
    const params = useParams()

    const [result, setResult] = useState({})
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const { data: evaluation, isFetching: isFetchingEvaluation, isError } = useGetEvaluationQuery(params.uuid)
    const [createResult, { isLoading: isCreatingResult }] = useCreateEvaluationResultMutation()

    const onSubmit = async () => {
        // Check if fields are filled
        const errors = evaluation.struct.filter((block) => block.required && !result[block.identifier])
        setErrors(errors.reduce((acc, block) => ({ ...acc, [block.identifier]: true }), {}))
        if (errors.length > 0) return

        const response = await createResult({
            uuid: params.uuid,
            result,
        })
        if (response.error) return

        toast.success(response.data.message)
        setSubmitted(true)
    }

    return (
        <>
            <Helmet>
                <title>Evaluation - Former22</title>
            </Helmet>
            <Container className="py-4">
                {isFetchingEvaluation || isError ? (
                    <div className="d-flex justify-content-center align-items-center h-vh">
                        <div className="d-flex flex-column align-items-center">
                            {isError ? (
                                <h4>Cette évaluation n'est pas ou plus accessible.</h4>
                            ) : (
                                <>
                                    <Spinner animation="grow" size="lg" className="mb-4" />
                                    <h4>Chargement</h4>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    evaluation.struct.map((block, i) => (
                        <div key={i}>
                            {errors[block.identifier] && (
                                <div className="text-danger">Cette question doit être remplie.</div>
                            )}
                            <Block.Render
                                onUpdate={(key, value) =>
                                    setResult({
                                        ...result,
                                        [key]: value,
                                    })
                                }
                                {...block}
                            />
                        </div>
                    ))
                )}

                <Button variant="primary" onClick={onSubmit} disabled={submitted || isCreatingResult}>
                    {submitted ? 'Évaluation envoyée' : isCreatingResult ? 'Envoi en cours' : 'Envoyer résultat'}
                </Button>
            </Container>
        </>
    )
}
