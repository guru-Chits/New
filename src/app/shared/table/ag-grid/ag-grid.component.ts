import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ITableColumn } from '../../interface/list-table';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnChanges, OnInit {

  @Input() width: string;
  @Input() height: string;
  @Input() columns: ITableColumn[] = [];
  @Input() rowData: any[] = [];
  @Input() searchImg:string
  @Input() filterImg:string
  @Input() search:boolean;
  @Input() filter:boolean;

  @Input() pageSize: number; // Input for dynamic page size
  @Input() gridOption: any;
    defaultPageSize: number = 5; // Default page size
  isActiveFilter: boolean = true;

  private gridApi!: GridApi;
  private gridColumnApi: any;
  
  columnSearchText: string = '';
  showFilterPopup: boolean = false;
  filterOptions: { [key: string]: any[] } = {};
  selectedFilters: { [key: string]: any[] } = {};
  filterVisibility: { [key: string]: boolean } = {};
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  showActiveToggle: boolean = false;
  displayedFields: any[] = [];
  filterList: any = {};
  showFilter: boolean = false;
  popupTop: number = 0;
  popupLeft: number = 0;
  data: any[] = [];
  isLoading: boolean = true;  // Loading state
  bg:any
  gridOptions: any;

  ngOnInit(): void {
    this.getFilteredFields();    
    this.initializeGridOptions();
    this.bg = this.searchImg === 'assets/table/black search.svg' ? '#ECEBF5' : '#ffffff';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && changes.rowData.currentValue) {
      this.data = this.rowData;
      this.generateFilterListFromColumns(this.columns, this.data);
      this.isLoading = false;
    }

    if (changes.pageSize && !changes.pageSize.firstChange) {
      this.gridOptions.paginationPageSize = this.pageSize || this.defaultPageSize;
      this.gridOptions.api.onPaginationChanged();
    }
    
  }

  initializeGridOptions() {
    this.gridOptions = {
      pagination: true,
      paginationPageSize: this.pageSize || this.defaultPageSize,
      columnDefs: this.columns,
      rowData: this.rowData,
      domLayout: 'normal', // Allows for scrolling if content exceeds height
    };

  }



  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  generateFilterListFromColumns(columns: ITableColumn[], rowData: any[]): void {
    this.filterList = {};
    columns.forEach(col => {
      if (col.filterList) {
        const field = col.field;        
        const uniqueValues = Array.from(new Set(rowData.map(row => row[field])));
        this.filterList[field] = { values: uniqueValues, selectedValues: [], showOptions: false };
      }
    });
    this.getFilteredFields();
  }

  filterTableData(event: MouseEvent): void {
    this.showFilter = !this.showFilter;
  }


  toggleFilter(field: string) {
    this.filterList[field].showOptions = !this.filterList[field].showOptions;
  }
  isFilterShown(field: string): boolean {
    return this.filterList[field]?.showOptions;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  
  handleCheckboxChange(field: string, value: any, event: any): void {
    console.log(event.target.checked);
    
      this.isActiveFilter = event.target.checked;
      // this.applyFilterActive();

    const selectedValues = this.filterList[field].selectedValues || [];
    if (event.target.checked) {
      selectedValues.push(value);

    } else {
      const index = selectedValues.indexOf(value);
      if (index > -1) {
        selectedValues.splice(index, 1);
      }
    }


  }

  applyFilters() {
    let filteredData = [...this.data];
    for (let key in this.filterList) {
      const selectedValues = this.filterList[key].selectedValues;

      if (selectedValues.length) {
        filteredData = filteredData.filter(item => 
          this.filterList[key].selectedValues.includes(item[key])
        );
      }
    }
    this.rowData = filteredData;
    this.showFilter = !this.showFilter;

  }

  clearFilters(): void {
    let filteredData = [...this.data];
    this.isActiveFilter
    filteredData = filteredData.filter(item => item.status !== 'Active' && item.status !== 'InActive');

    for (let field in this.filterList) {
      if (this.filterList.hasOwnProperty(field)) {
        this.filterList[field].selectedValues = []; // Clear the selected values
      }
    }

    this.rowData = filteredData;
    console.log("table data", this.rowData);
    this.showFilter = !this.showFilter;

  }
  getFilteredFields(): void {
    this.displayedFields = Object.keys(this.filterList);    
  }
  closePopup() {
    this.showFilter = !this.showFilter;
  }
}
