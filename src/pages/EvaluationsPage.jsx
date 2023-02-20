import { useState, useMemo } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'

import { Grid, EvaluationModal } from '../components'
import { useGetEvaluationsQuery } from '../services/evaluations'
import { gridContextMenu } from '../utils'

export function EvaluationsPage() {
    const LEVEL_COURSE = 2
    const LEVEL_SESSION = 3
    const LEVEL_EVENT = 4

    const {
        data: evaluationsData,
        isFetching: isFetchingEvents,
        refetch: refetchEvaluationss,
    } = useGetEvaluationsQuery(null, { refetchOnMountOrArgChange: true })

    const [evaluationModalVisible, setEvaluationModalVisible] = useState(false)

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
                rowGroup: true,
                hide: true,
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
                isDataLoading={isFetchingEvents}
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
                    ...(node.level === LEVEL_COURSE
                        ? [
                              {
                                  name: 'Envoyer évaluations',
                                  action: () => {
                                      console.log('envoi des évaluations')
                                  },
                              },
                          ]
                        : []),
                    ...gridContextMenu,
                ]}
            />
            <Container fluid className="mb-2">
                <Button variant="success" className="me-2" onClick={() => setEvaluationModalVisible(true)}>
                    Générer évaluation
                </Button>
            </Container>

            <EvaluationModal
                closeModal={() => {
                    setEvaluationModalVisible(false)
                }}
                isVisible={evaluationModalVisible}
            />
        </>
    )
}
