import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import surveyDataMock from "./../mock/survey-data";

import React, { useState, useEffect } from "react";
import base64 from "base-64";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllModules } from "@ag-grid-enterprise/all-modules";
ModuleRegistry.registerModules(AllModules);

function SurveyGrid() {
  const [columnDefs] = useState([
    {
      headerName: "Response",
      field: "response",
    },
    {
      headerName: "Count",
      field: "count",
    },
  ]);
  const [rowData, setRowData] = useState(null);

  const createChartContainer = (chartRef) => {
    // setChart(chartRef.chartElement);
    console.log(chartRef.chartElement);
  };

  useEffect(() => {
    fetch("https://cep-dev.ch/apiv2/workspace/3", {
      method: "GET",
      mode: "no-cors",
      credentials: "include",
      headers: new Headers({
        "X-Auth-Token": "c1b3fae80065e32fbcaf1bf0beae3392848a",
        Cookie: "PHPSESSID=71f4632f847479593c50fd6c81c4dace",
        Authorization: "Basic " + base64.encode("user:abc123"),
      }),
    }).then(console.log);
    setRowData(surveyDataMock);
  }, []);

  return (
    <div>
      <div className="chart-container"></div>
      <div className="ag-theme-alpine survey-grid vertical-centered">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          enableCharts={true}
          enableRangeSelection={true}
          createChartContainer={createChartContainer}
          popupParent={document.body}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default SurveyGrid;
