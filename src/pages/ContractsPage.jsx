import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button } from 'react-bootstrap'

import { Grid, ContractModal, FloatCellEditor } from '../components'
import { useGetEventsQuery, useUpdateEventMutation } from '../services/events'
import { useUpdateSessionMutation } from '../services/sessions'
import { useUpdateContractMutation } from '../services/contracts'
import { gridContextMenu } from '../utils'

export function ContractsPage() {
    const {
        data: eventsData,
        isFetching: isFetchingEvents,
        refetch: refetchEvents,
    } = useGetEventsQuery(null, { refetchOnMountOrArgChange: true })
    const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateEventMutation()
    const [updateSession, { isLoading: isUpdatingSession }] = useUpdateSessionMutation()
    const [updateContract, { isLoading: isUpdatingContract }] = useUpdateContractMutation()

    const [contractModalVisible, setContractModalVisible] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)

    const buildCourseFromNode = (node) => {
        const course = node.allLeafChildren[0].data

        return {
            uuid: course.courseUuid,
            name: course.courseName,
            contract: course.contract,
            user: {
                uuid: course.userUuid,
                name: course.userName,
            },
            sessions: node.childrenAfterGroup.map(({ key: name, childrenAfterGroup: events }) => {
                return {
                    name,
                    events: events.map(({ data }) => data),
                }
            }),
        }
    }

    const columnDefs = useMemo(
        () => [
            {
                field: 'userName',
                headerName: 'Formateur',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le nom du formateur',
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
            {
                field: 'date',
                headerName: 'Date',
                filter: 'agDateColumnFilter',
                headerTooltip: 'La date de la séance',
            },
            {
                field: 'startTime',
                headerName: 'Heure de début',
                filter: 'agDateColumnFilter',
                headerTooltip: "L'heure de début de la séance",
            },
            {
                field: 'endTime',
                headerName: 'Heure de fin',
                filter: 'agDateColumnFilter',
                headerTooltip: "L'heure de fin de la séance",
            },
            {
                field: 'contract',
                headerName: 'Contrat',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Le contrat lié au formateur/trice',
                cellRenderer: ({ node }) =>
                    node.level === 1 ? (
                        node.childrenAfterGroup[0].childrenAfterGroup[0].data.contract ? (
                            <Button variant="primary" onClick={() => ''} size="sm" className="edit-button-style">
                                Contract
                            </Button>
                        ) : (
                            <span>Aucun contract</span>
                        )
                    ) : (
                        <span></span>
                    ),
            },
            {
                field: 'eventFees',
                headerName: 'Honoraires',
                filter: 'agTextColumnFilter',
                headerTooltip: 'les honoraires de la session',
                valueGetter: ({ node, data }) => {
                    if (node.level === 2) return data.eventFees
                },
                aggFunc: ({ rowNode }) =>
                    rowNode.level === 2
                        ? rowNode.allLeafChildren.reduce((sum, leaf) => sum + leaf.data.eventFees, 0)
                        : '',
            },
            {
                field: 'isFeesPaid',
                headerName: 'Honoraires payé',
                filter: 'agTextColumnFilter',
                headerTooltip: 'Les honoraires de la séance (payé ou non)',
                editable: (params) => params.node.level === 3,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['Payé', 'Non payé'],
                },
                valueGetter: ({ node, data }) => {
                    if (node.level === 3) return data.isFeesPaid ? 'Payé' : 'Non payé'
                },
                valueSetter: async (params) => {
                    await updateEvent({ uuid: params.data.eventUuid, isFeesPaid: params.newValue[0] === 'P' })
                    await refetchEvents()
                    return true
                },
            },
            {
                field: 'eventFees',
                headerName: 'Honoraires séance',
                filter: 'agNumberColumnFilter',
                headerTooltip: 'les honoraires de la séance',
                editable: (params) => params.node.level === 3,
                cellEditor: FloatCellEditor,
                valueGetter: ({ data }) => {
                    if (data) return data.eventFees
                },
                valueSetter: async (params) => {
                    await updateEvent({ uuid: params.data.eventUuid, fees: params.newValue })
                    await refetchEvents()
                    return true
                },
            },
        ],
        []
    )

    return (
        <>
            <Helmet>
                <title>Contrats - Former22</title>
            </Helmet>
            <Grid
                isDataLoading={isFetchingEvents}
                name="Inscription séances"
                columnDefs={columnDefs}
                rowData={eventsData}
                groupDisplayType={'singleColumn'}
                rowGroupPanelShow={false}
                autoGroupColumnDef={{
                    headerName: 'Formateurs/Cours/Sessions',
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
                getContextMenuItems={({ node }) => [
                    ...(node.level === 1
                        ? [
                              {
                                  name: 'Créer contrat',
                                  action: () => {
                                      setSelectedCourse(buildCourseFromNode(node))
                                      setContractModalVisible(true)
                                  },
                              },
                          ]
                        : []),
                    ...gridContextMenu,
                ]}
            />

            <ContractModal
                closeModal={() => {
                    setContractModalVisible(false)
                    setSelectedCourse(null)
                }}
                selectedCourse={selectedCourse}
                isVisible={contractModalVisible}
                createContract={(templateId) => {
                    updateContract({
                        userId: selectedCourse.user.uuid,
                        courseId: selectedCourse.uuid,
                        templateId,
                    })
                }}
            />
        </>
    )
}
