import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { ITableColumn } from '../../interface/list-table';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.css'
})
export class AgGridComponent {
  
  @Input() width: string;
  @Input() height: string;
  private gridApi!: GridApi;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: number[] = [];
  showLeftDots: boolean = false;
  showRightDots: boolean = false;
  @Input() columns: ColDef[] ;
  @Input() rowData: any[] ;
  gridColumnApi: any;

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    // filter: true,
    resizable: true,
  };

  ngOnInit(): void {
    console.log(this.rowData)
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.gridColumnApi = params.columnApi;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }




  }