import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import surveyDataMock from './../mock/survey-data'

import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules'
ModuleRegistry.registerModules(AllModules)

function ResultsPage() {
    const [columnDefs] = useState([
        {
            headerName: 'Response',
            field: 'response',
        },
        {
            headerName: 'Count',
            field: 'count',
        },
    ])
    const [rowData, setRowData] = useState(null)

    useEffect(() => setRowData(surveyDataMock), [])

    return (
        <div className="page ag-theme-alpine general-grid mb-3 mx-auto">
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                enableCharts={true}
                enableRangeSelection={true}
                popupParent={document.body}
            ></AgGridReact>
        </div>
    )
}

export default ResultsPage
