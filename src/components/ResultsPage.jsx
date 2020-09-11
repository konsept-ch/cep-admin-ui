import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import surveyDataMock from './../mock/survey-data'

function ResultsPage() {
    const columnDefs = [
        {
            headerName: 'Response',
            field: 'response',
        },
        {
            headerName: 'Count',
            field: 'count',
        },
    ]
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
