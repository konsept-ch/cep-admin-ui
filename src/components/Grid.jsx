import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Row, Col, InputGroup, FloatingLabel, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/pro-light-svg-icons'
import { localeText } from '../localeText'

export function Grid({ rowData, columnDefs }) {
    const [gridApi, setGridApi] = useState(null)
    const [filterValue, setFilterValue] = useState('')

    const onFirstDataRendered = ({ columnApi }) => {
        columnApi.autoSizeAllColumns()
    }

    useEffect(() => {
        gridApi?.setQuickFilter(filterValue)
    }, [filterValue, gridApi])

    return (
        <Row>
            <Col className="mb-4">
                <InputGroup>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 150 }}
                        overlay={(props) => <Tooltip {...props}>Effacer le filtre</Tooltip>}
                    >
                        <Button variant="outline-danger" size="lg" onClick={() => setFilterValue('')}>
                            <FontAwesomeIcon icon={faFilterCircleXmark} />
                        </Button>
                    </OverlayTrigger>
                    <FloatingLabel label="Rechercher" className="grid-search-label">
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
            <div className="ag-theme-alpine general-grid page mx-auto mb-4">
                <AgGridReact
                    {...{
                        enableCharts: true,
                        enableRangeSelection: true,
                        defaultColDef: {
                            resizable: true,
                            sortable: true,
                            filter: true,
                        },
                        columnDefs,
                        rowData,
                        localeText,
                        onFirstDataRendered,
                        onGridReady: ({ api }) => setGridApi(api),
                    }}
                />
            </div>
        </Row>
    )
}
