import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  ngOnInit(): void {
    this.getFilteredFields();    
    if(this.searchImg=='assets/table/black search.svg'){
      this.bg="#ECEBF5"
    }
    else{
      this.bg='#ffffff'
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && changes.rowData.currentValue) {
      this.data = this.rowData;
      this.generateFilterListFromColumns(this.columns, this.data);
      this.isLoading = false;
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  generateFilterListFromColumns(columns: ITableColumn[], rowData: any[]): void {
    this.filterList = {};
    columns.forEach(col => {
      if (col.filter) {
        const field = col.field;
        const uniqueValues = Array.from(new Set(rowData.map(row => row[field])));
        this.filterList[field] = { values: uniqueValues, selectedValues: [], showOptions: false };
      }
    });
    this.getFilteredFields();
  }

  filterTableData(event: MouseEvent): void {
    this.showFilter = !this.showFilter;
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    this.popupTop = buttonRect.bottom + window.scrollY;
    this.popupLeft = buttonRect.left + window.scrollX;
  }


  toggleFilter(field: string) {
    this.filterList[field].showOptions = !this.filterList[field].showOptions;
  }
  isFilterShown(field: string): boolean {
    return this.filterList[field]?.showOptions;
  }

  // getUniqueValues(data: any[], field: string) {
  //   return Array.from(new Set(data.map(item => item[field]))); // Use Array.from to ensure it's an array
  // }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  
  handleCheckboxChange(field: string, value: any, event: any): void {
      this.isActiveFilter = event.target.checked;
      this.applyFilterActive();

    const selectedValues = this.filterList[field].selectedValues || [];
    if (event.target.checked) {
      selectedValues.push(value);
    } else {
      const index = selectedValues.indexOf(value);
      if (index > -1) {
        selectedValues.splice(index, 1);
      }
    }
    // this.filterList[field].selectedValues = selectedValues;
    this.applyFilters();
  }

 
  applyFilterActive() {
    let filteredData = [...this.data];
    console.log("data", filteredData);
    
    if (filteredData.some(item => 'status' in item)) {
      this.showActiveToggle = true;
      console.log("isActive", this.isActiveFilter);
      
      // Only apply the status filter if the status field exists in the data
      if (this.isActiveFilter) {
        filteredData = filteredData.filter(item => item.status === 'Active');
        console.log("active data", filteredData);
      } else if(this.isActiveFilter === false) {
        filteredData = filteredData.filter(item => item.status === 'InActive');
        console.log("in active data", filteredData);
      }else {
        filteredData = filteredData.filter(item => item.status !== 'Active' && item.status !== 'InActive');
        console.log("neither active nor inactive data", filteredData);
      }
    }
    this.rowData = filteredData;
    console.log("table data", this.rowData);
    
  }

  applyFilters() {
    let filteredData = [...this.rowData];
    for (let key in this.filterList) {
      const selectedValues = this.filterList[key].selectedValues;

      if (selectedValues.length) {
        filteredData = filteredData.filter(item => 
          this.filterList[key].selectedValues.includes(item[key])
        );
      }
    }
    this.rowData = filteredData;
  }

  clearFilters(): void {
    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
    Object.keys(this.filterList).forEach(field => {
      this.filterList[field].selectedValues = [];
    });
    this.showFilter = false;
  }
  getFilteredFields(): void {
    this.displayedFields = Object.keys(this.filterList);
    console.log(this.displayedFields);
    
  }
  closePopup() {
    this.showFilter = !this.showFilter;
  }
}
