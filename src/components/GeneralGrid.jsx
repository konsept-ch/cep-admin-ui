import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";

import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllModules } from "@ag-grid-enterprise/all-modules";

ModuleRegistry.registerModules(AllModules);

class GeneralGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Make",
          field: "make",
        },
        {
          headerName: "Model",
          field: "model",
        },
        {
          headerName: "Price",
          field: "price",
        },
      ],
      rowData: null,
    };
  }

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json"
    )
      .then((result) => result.json())
      .then((rowData) => this.setState({ rowData }));
  }

  render() {
    return (
      <div className="ag-theme-alpine general-grid vertical-centered">
        <AgGridReact
          enableCharts={true}
          enableRangeSelection={true}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
        ></AgGridReact>
      </div>
    );
  }
}

export default GeneralGrid;
