import { useState, useMemo } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

import { Grid, EvaluationModal } from '../components'
import { useGetEvaluationsQuery } from '../services/evaluations'
import { PATH_EVALUATIONS } from '../constants/constants'
import { gridContextMenu } from '../utils'

export function EvaluationsPage() {
    const LEVEL_COURSE = 2

    const navigate = useNavigate()

    const [evaluationModal, setEvaluationModal] = useState({
        data: null,
        visible: false,
    })

    const {
        data: evaluationsData,
        isFetching: isFetchingEvaluations,
        refetch: refetchEvaluations,
    } = useGetEvaluationsQuery(null, { refetchOnMountOrArgChange: true })

    const columnDefs = useMemo(
        () => [
            {
                field: 'year',
                headerName: 'Année',
                filter: 'agNumberColumnFilter',
                headerTooltip: "L'année de la formation",
                rowGroup: true,
                hide: true,
            },
            {
                field: 'courseName',
                headerName: 'Cours',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom du cours',
                rowGroup: true,
                hide: true,
            },
            {
                field: 'sessionName',
                headerName: 'Session',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom de la session',
            },
            {
                field: 'link',
                headerName: 'Lien',
                headerTooltip: "Le lien vers l'évaluation",
                cellRenderer: ({ node }) => {
                    return node.level == LEVEL_COURSE ? (
                        <a
                            href={`/${PATH_EVALUATIONS}/${node.data.uuid}`}
                            onClick={() => navigate(`/${PATH_EVALUATIONS}/${node.data.uuid}`)}
                        >{`${process.env.PUBLIC_URL}/${PATH_EVALUATIONS}/${node.data.uuid}`}</a>
                    ) : (
                        <span></span>
                    )
                },
            },
        ],
        []
    )

    return (
        <>
            <Helmet>
                <title>Evaluations - Former22</title>
            </Helmet>
            <Grid
                isDataLoading={isFetchingEvaluations}
                name="Evaluations"
                columnDefs={columnDefs}
                rowData={evaluationsData}
                groupDisplayType={'singleColumn'}
                rowGroupPanelShow={false}
                groupDefaultExpanded={0}
                autoGroupColumnDef={{
                    headerName: 'Années/Cours/Sessions',
                    minWidth: 400,
                    cellRendererParams: {
                        suppressCount: true,
                    },
                }}
                groupIncludeFooter={false}
                defaultColDef={{
                    aggFunc: false,
                }}
                enableGroupEdit={true}
                sideBar={{
                    toolPanels: ['filters'],
                    defaultToolPanel: false,
                    hiddenByDefault: false,
                }}
                getContextMenuItems={({ node }) => [
                    ...(node.level == LEVEL_COURSE
                        ? [
                              {
                                  name: 'Renvoyer évaluation',
                                  action: () => {
                                      setEvaluationModal({
                                          data: {
                                              template: node.data.templateUuid,
                                              session: {
                                                  label: node.data.sessionName,
                                                  value: node.data.sessionUuid,
                                              },
                                          },
                                          visible: true,
                                      })
                                  },
                              },
                              'separator',
                          ]
                        : []),
                    ...gridContextMenu,
                ]}
            />
            <Container fluid className="mb-2">
                <Button
                    variant="success"
                    className="me-2"
                    onClick={() => setEvaluationModal({ data: null, visible: true })}
                >
                    Générer évaluation
                </Button>
            </Container>

            <EvaluationModal
                closeModal={() => {
                    setEvaluationModal({ data: null, visible: false })
                    refetchEvaluations()
                }}
                data={evaluationModal.data}
                isVisible={evaluationModal.visible}
            />
        </>
    )
}
