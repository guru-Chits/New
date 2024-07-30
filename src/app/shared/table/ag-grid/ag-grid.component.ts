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
    this.updatePaginationInfo();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }


  onPaginationChanged(event: any) {
    if (this.gridApi) {
      this.updatePaginationInfo();
    }
  }

  updatePaginationInfo() {
    if (this.gridApi) {
      this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      this.totalPages = this.gridApi.paginationGetTotalPages();
      this.updateVisiblePages();
    }
  }

  updateVisiblePages() {
    const pagesToShow = 3;
    const half = Math.floor(pagesToShow / 2);
    this.showLeftDots = this.currentPage > half + 1;
    this.showRightDots = this.currentPage < this.totalPages - half;

    let startPage = Math.max(2, this.currentPage - half);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + half);

    if (this.currentPage <= half + 1) {
      endPage = Math.min(this.totalPages - 1, pagesToShow);
    }

    if (this.currentPage >= this.totalPages - half) {
      startPage = Math.max(2, this.totalPages - pagesToShow + 1);
    }

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  isPageInVisibleRange(page: number): boolean {
    return this.visiblePages.includes(page) || page === 1 || page === this.totalPages;
  }

  goToPage(page: number) {
    this.gridApi.paginationGoToPage(page - 1);
  }

  onBtFirst() {
    this.gridApi.paginationGoToFirstPage();
  }

  onBtPrevious() {
    this.gridApi.paginationGoToPreviousPage();
  }

  onBtNext() {
    this.gridApi.paginationGoToNextPage();
  }

  onBtLast() {
    this.gridApi.paginationGoToLastPage();
  }}