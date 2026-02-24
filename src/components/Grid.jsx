import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import PuffLoader from 'react-spinners/PuffLoader'
import classNames from 'classnames'

import { localeText } from '../agGridLocaleText'
import { gridContextMenu, STATUSES } from '../utils'
import { useLocation } from 'react-router-dom'
import { mapPathnameToIcon } from '../constants/constants'
import { GroupSummaryBar } from './GroupSummaryBar'

export const Grid = ({
    name,
    activePredefinedFiltersById,
    setActivePredefinedFiltersById,
    predefinedFilters = [],
    rowData,
    isDataLoading = false,
    components = {},
    defaultColDef,
    defaultSortModel,
    sortModel,
    groupModel,
    filterModel = undefined,
    showGroupSummary = false,
    ...gridProps
}) => {
    const [gridApi, setGridApi] = useState(null)
    const [gridColumnApi, setGridColumnApi] = useState(null)
    const [filterValue, setFilterValue] = useState('')
    const [groupSummaryItems, setGroupSummaryItems] = useState([])
    const groupSummaryKeyRef = useRef('')
    const [groupSummaryRowIndex, setGroupSummaryRowIndex] = useState(null)
    const location = useLocation()

    useEffect(() => {
        gridApi?.setQuickFilter(filterValue)
    }, [filterValue, gridApi])

    useEffect(() => {
        // this setTimeout fixes a race condition
        setTimeout(() => {
            if (isDataLoading) {
                gridApi?.showLoadingOverlay()
            } else {
                gridApi?.hideOverlay()
            }
        }, 0)
    }, [isDataLoading, gridApi])

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
                    values: activePredefinedFiltersById['onlyWebEntries']
                        ? [STATUSES.ENTREE_WEB, STATUSES.VALIDE_PAR_RH]
                        : null,
                })

                // refresh rows based on the filter (not automatic to allow for batching multiple filters)
                gridApi.onFilterChanged()
            }
        }, 200)
    }, [activePredefinedFiltersById, name, rowData, gridApi])

    useEffect(() => {
        if (filterModel === undefined || gridApi == null) return
        gridApi.setFilterModel(filterModel)
    }, [gridApi, filterModel])

    const updateGroupSummary = useCallback(() => {
        if (!showGroupSummary || gridApi == null) return

        const focusedCell = gridApi.getFocusedCell?.()
        const rowIndex =
            groupSummaryRowIndex ??
            (focusedCell && typeof focusedCell.rowIndex === 'number' ? focusedCell.rowIndex : null)

        const row = rowIndex != null ? gridApi.getDisplayedRowAtIndex(rowIndex) : gridApi.getDisplayedRowAtIndex(0)

        if (row == null) {
            setGroupSummaryItems([])
            groupSummaryKeyRef.current = ''
            return
        }

        let cursor = row
        if (!cursor.group && cursor.parent) {
            cursor = cursor.parent
        }

        if (!cursor?.group) {
            setGroupSummaryItems([])
            groupSummaryKeyRef.current = ''
            return
        }

        const items = []
        while (cursor?.group && cursor.level >= 0) {
            const count = cursor.allChildrenCount
            const value = cursor.key ?? ''
            const text = count == null ? value : `${value} (${count})`
            items.push({
                text,
                tooltip: value,
            })
            cursor = cursor.parent
        }

        items.reverse()
        const key = items.map(({ text }) => text).join('|')
        if (key === groupSummaryKeyRef.current) return

        groupSummaryKeyRef.current = key
        setGroupSummaryItems(items)
    }, [gridApi, showGroupSummary])

    useEffect(() => {
        if (!showGroupSummary || gridApi == null) return
        updateGroupSummary()

        const handleUpdate = () => updateGroupSummary()
        const handleRowClicked = (event) => setGroupSummaryRowIndex(event?.rowIndex ?? null)
        gridApi.addEventListener('modelUpdated', handleUpdate)
        gridApi.addEventListener('displayedRowsChanged', handleUpdate)
        gridApi.addEventListener('bodyScroll', handleUpdate)
        gridApi.addEventListener('rowClicked', handleRowClicked)

        return () => {
            gridApi.removeEventListener('modelUpdated', handleUpdate)
            gridApi.removeEventListener('displayedRowsChanged', handleUpdate)
            gridApi.removeEventListener('bodyScroll', handleUpdate)
            gridApi.removeEventListener('rowClicked', handleRowClicked)
        }
    }, [gridApi, showGroupSummary, updateGroupSummary])

    useEffect(() => {
        if (gridColumnApi == null || groupModel === undefined) return

        if (Array.isArray(groupModel) && groupModel.length === 0) {
            const resetState = (gridColumnApi.getColumnState?.() ?? []).map(({ colId }) => ({
                colId,
                rowGroup: false,
                rowGroupIndex: null,
            }))
            gridColumnApi.applyColumnState({
                state: resetState,
                defaultState: { rowGroup: false, rowGroupIndex: null },
            })
            return
        }

        gridColumnApi.applyColumnState({
            state: groupModel,
            defaultState: { rowGroup: false, rowGroupIndex: null },
        })
    }, [gridColumnApi, groupModel])

    useEffect(() => {
        if (gridColumnApi == null) return
        const modelToApply = sortModel ?? defaultSortModel
        if (modelToApply === undefined) return

        if (Array.isArray(modelToApply) && modelToApply.length === 0) {
            const resetState = (gridColumnApi.getColumnState?.() ?? []).map(({ colId }) => ({
                colId,
                sort: null,
                sortIndex: null,
            }))
            gridColumnApi.applyColumnState({
                state: resetState,
                defaultState: { sort: null, sortIndex: null },
            })
            return
        }

        gridColumnApi.applyColumnState({
            state: modelToApply,
            defaultState: { sort: null, sortIndex: null },
        })
    }, [gridColumnApi, sortModel, defaultSortModel])

    const onGridReady = useCallback(({ api, columnApi }) => {
        setGridApi(api)
        setGridColumnApi(columnApi)
    }, [])

    const pageIcon = useMemo(() => mapPathnameToIcon[location.pathname], [location.pathname])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Row className="predefined-filters">
                            <Col>
                                <h1 className="mt-3">
                                    {mapPathnameToIcon[location.pathname] != null && (
                                        <>
                                            <FontAwesomeIcon icon={pageIcon} />{' '}
                                        </>
                                    )}
                                    {name}
                                </h1>
                            </Col>
                            {predefinedFilters.length > 0 && <Col />}
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
            {showGroupSummary && <GroupSummaryBar items={groupSummaryItems} />}
            <div className="ag-theme-alpine general-grid">
                <AgGridReact
                    {...{
                        sideBar: {
                            toolPanels: ['columns', 'filters'],
                            defaultToolPanel: false,
                            hiddenByDefault: false,
                        },
                        enableCharts: true,
                        enableRangeSelection: true,
                        enableCellChangeFlash: true,
                        enableFillHandle: true,
                        paginationAutoPageSize: true,
                        animateRows: true,
                        groupIncludeFooter: true,
                        groupSelectsChildren: true,
                        groupRowsSticky: false,
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
                            headerCheckboxSelectionFilteredOnly: true,
                            ...defaultColDef,
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
                            customLoadingOverlay: () => <PuffLoader color="#e8ca01" loading size={100} />,
                            ...components,
                        },
                        loadingOverlayComponent: 'customLoadingOverlay',
                        getContextMenuItems: () => gridContextMenu,
                        getRowId: ({ data }) => data.id,
                        localeText,
                        onGridReady,
                        rowData,
                        ...gridProps,
                    }}
                />
            </div>
        </>
    )
}
