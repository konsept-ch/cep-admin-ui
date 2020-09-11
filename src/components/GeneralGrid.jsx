import React from 'react'
import { useSelector } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import { dataSelector } from '../reducers/data'

function GeneralGrid() {
    const columnDefs = [
        {
            headerName: 'Name',
            field: 'name',
        },
        {
            headerName: 'Id',
            field: '_id',
        },
        {
            headerName: 'V',
            field: '__v',
        },
    ]
    const data = useSelector(dataSelector)

    return (
        <div className="ag-theme-alpine general-grid page mx-auto mb-3">
            <AgGridReact
                enableCharts={true}
                enableRangeSelection={true}
                columnDefs={columnDefs}
                rowData={data}
            ></AgGridReact>
        </div>
    )
}

export default GeneralGrid
