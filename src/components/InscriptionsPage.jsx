import { useSelector } from 'react-redux'
import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Container, InputGroup, FormControl, Button, Col } from 'react-bootstrap'
import { dataSelector } from '../reducers/data'
// import { localeText } from '../localeText'

export function InscriptionsPage() {
    const rowData = useSelector(dataSelector)
    const columnDefs = [
        {
            headerName: 'Participant',
            field: 'participant',
        },
        {
            headerName: 'Fonction/Profession',
            field: 'profession',
        },
        {
            headerName: 'Session',
            field: 'session',
        },
        {
            headerName: 'Statut',
            field: 'status',
        },
        {
            headerName: 'Date de début',
            field: 'startDate',
            // This is needed if it is more complicated object with cellRenderer
            // getQuickFilterText: function(params) {
            //     return params.value.name;
            // }
        },
    ]

    const onFirstDataRendered = (params) => {
        params.columnApi.autoSizeAllColumns()
    }

    const onFilterInputChanged = () => {
        if (gridApi) {
            gridApi.setQuickFilter(filterValue)
        }
    }

    const [gridApi, setGridApi] = React.useState(null)
    const [filterValue, setFilterValue] = React.useState('')

    React.useEffect(() => {
        onFilterInputChanged()
    }, [filterValue])

    return (
        <>
            <Container fluid>
                <h1 className="mt-3">Inscriptions</h1>
                <Col md="6">
                    <InputGroup className="mb-4">
                        <FormControl
                            placeholder="participant/formation/statut/date/... "
                            aria-label="participant/formation/statut/date/... "
                            aria-describedby="basic-addon2"
                            value={filterValue}
                            onChange={(e) => {
                                setFilterValue(e.target.value)
                            }}
                        />
                        <Button variant="primary" id="button-addon2" onClick={onFilterInputChanged}>
                            Rechercher
                        </Button>
                    </InputGroup>
                </Col>
                <div className="ag-theme-alpine general-grid page mx-auto mb-3">
                    <AgGridReact
                        {...{
                            enableCharts: true,
                            enableRangeSelection: true,
                            defaultColDef: {
                                resizable: true,
                                sortable: true,
                            },
                            columnDefs,
                            rowData,
                            //localeText,
                            onFirstDataRendered,
                            onGridReady: ({ api }) => {
                                setGridApi(api)
                            },
                        }}
                    />
                </div>
            </Container>
        </>
    )
}
