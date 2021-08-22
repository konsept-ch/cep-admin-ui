import { AgGridReact } from 'ag-grid-react'
import { localeText } from '../localeText'

export function Grid({ rowData, columnDefs }) {
    const onFirstDataRendered = (params) => {
        params.columnApi.autoSizeAllColumns()
    }

    return (
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
                    localeText,
                    onFirstDataRendered,
                }}
            />
        </div>
    )
}
