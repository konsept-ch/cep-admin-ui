import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import {
    Row,
    Col,
    InputGroup,
    FloatingLabel,
    FormControl,
    Button,
    OverlayTrigger,
    Tooltip,
    Container,
    Form,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/pro-light-svg-icons'
import PuffLoader from 'react-spinners/PuffLoader'
import classNames from 'classnames'

import { localeText } from '../agGridLocaleText'
import { gridLoadingSelector } from '../reducers'
import { gridContextMenu } from '../utils'

const Loader = () => <PuffLoader color="#e8ca01" loading size={100} />

export const Grid = ({
    name,
    activePredefinedFiltersById,
    setActivePredefinedFiltersById,
    predefinedFilters = [],
    rowData,
    isDataLoading,
    ...gridProps
}) => {
    const [gridApi, setGridApi] = useState(null)
    const [filterValue, setFilterValue] = useState('')
    const isGridLoading = useSelector(gridLoadingSelector)
    const isLoading = isDataLoading ?? isGridLoading

    useEffect(() => {
        gridApi?.setQuickFilter(filterValue)
    }, [filterValue, gridApi])

    useEffect(() => {
        // this setTimeout fixes a race condition
        setTimeout(() => {
            if (isLoading) {
                gridApi?.showLoadingOverlay()
            } else {
                gridApi?.hideOverlay()
            }
        }, 0)
    }, [isLoading, gridApi])

    useEffect(() => {
        // this setTimeout fixes a race condition
        setTimeout(() => {
            // TODO: move logic to InscriptionsPage
            if (gridApi && name === 'Participants') {
                // get filter instance
                const filterInstance = gridApi.getFilterInstance('status')

                // set filter model and update
                filterInstance.setModel({
                    filterType: 'set',
                    values: activePredefinedFiltersById['onlyWebEntries'] ? ['Entrée Web'] : null,
                })

                // refresh rows based on the filter (not automatic to allow for batching multiple filters)
                gridApi.onFilterChanged()
            }
        }, 0)
    }, [activePredefinedFiltersById, name, rowData, gridApi])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Row className="predefined-filters">
                            <Col>
                                <h1 className="mt-3">{name}</h1>
                            </Col>
                            <Col />
                            {predefinedFilters.map(({ id, label }) => (
                                <Col className="my-auto" key={id}>
                                    <Form.Group controlId={id}>
                                        <Form.Check
                                            type="checkbox"
                                            label={label}
                                            className={classNames({ 'is-active': activePredefinedFiltersById[id] })}
                                            checked={activePredefinedFiltersById[id]}
                                            onChange={({ target }) =>
                                                setActivePredefinedFiltersById({
                                                    ...activePredefinedFiltersById,
                                                    [id]: target.checked,
                                                })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <InputGroup className="justify-content-end">
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 150 }}
                                overlay={(props) => <Tooltip {...props}>Effacer le filtre</Tooltip>}
                            >
                                <Button variant="outline-danger" size="lg" onClick={() => setFilterValue('')}>
                                    <FontAwesomeIcon icon={faFilterCircleXmark} />
                                </Button>
                            </OverlayTrigger>
                            <FloatingLabel label="Rechercher" className="grid-quick-search-label">
                                <FormControl
                                    placeholder="Rechercher..."
                                    aria-label="Rechercher..."
                                    aria-describedby="rechercher"
                                    value={filterValue}
                                    onChange={({ target }) => setFilterValue(target.value)}
                                />
                            </FloatingLabel>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
            <div className="ag-theme-alpine general-grid">
                <AgGridReact
                    {...{
                        // debug: true,
                        sideBar: {
                            toolPanels: ['columns', 'filters'],
                            defaultToolPanel: false,
                            hiddenByDefault: false,
                        },
                        suppressReactUi: true, // TODO report cell editor dropdown issue to ag-Grid
                        enableCharts: true,
                        enableRangeSelection: true,
                        enableCellChangeFlash: true,
                        enableFillHandle: true,
                        paginationAutoPageSize: true,
                        animateRows: true,
                        groupIncludeFooter: true,
                        groupSelectsChildren: true,
                        suppressAggFuncInHeader: true,
                        rowSelection: 'multiple',
                        suppressRowClickSelection: true,
                        rowGroupPanelShow: 'always',
                        pivotPanelShow: 'always',
                        groupDisplayType: 'multipleColumns',
                        groupDefaultExpanded: -1,
                        defaultColDef: {
                            enableValue: true,
                            enablePivot: true,
                            enableRowGroup: true,
                            resizable: true,
                            sortable: true,
                            filter: true,
                            aggFunc: 'count',
                        },
                        statusBar: {
                            statusPanels: [
                                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                                { statusPanel: 'agFilteredRowCountComponent' },
                                { statusPanel: 'agSelectedRowCountComponent' },
                                { statusPanel: 'agAggregationComponent' },
                            ],
                        },
                        components: {
                            customLoadingOverlay: Loader,
                        },
                        loadingOverlayComponent: 'customLoadingOverlay',
                        getContextMenuItems: () => gridContextMenu,
                        getRowId: ({ data }) => data.id,
                        localeText,
                        onGridReady: ({ api }) => setGridApi(api),
                        rowData,
                        ...gridProps,
                    }}
                />
            </div>
        </>
    )
}
