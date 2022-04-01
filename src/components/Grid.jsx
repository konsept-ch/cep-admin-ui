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
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/pro-light-svg-icons'
import PuffLoader from 'react-spinners/PuffLoader'

import { localeText } from '../agGridLocaleText'
import { gridLoadingSelector } from '../reducers'
import { gridContextMenu } from '../utils'

const Loader = () => <PuffLoader color="#e8ca01" loading size={100} />

export const Grid = ({ name, ...gridProps }) => {
    const [gridApi, setGridApi] = useState(null)
    const [filterValue, setFilterValue] = useState('')
    const isGridLoading = useSelector(gridLoadingSelector)

    useEffect(() => {
        gridApi?.setQuickFilter(filterValue)
    }, [filterValue, gridApi])

    useEffect(() => {
        gridProps.getGridApi?.(gridApi)
    }, [gridApi, gridProps])

    useEffect(() => {
        // this setTimeout fixes a race condition
        setTimeout(() => {
            if (isGridLoading) {
                gridApi?.showLoadingOverlay()
            } else {
                gridApi?.hideOverlay()
            }
        }, 0)
    }, [isGridLoading, gridApi])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <h1 className="mt-4">{name}</h1>
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
                        rowGroupPanelShow: 'always',
                        pivotPanelShow: 'always',
                        groupDisplayType: 'multipleColumns',
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
                        ...gridProps,
                    }}
                />
            </div>
        </>
    )
}
