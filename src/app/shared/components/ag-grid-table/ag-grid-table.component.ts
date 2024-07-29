import { Component,Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ITableColumn } from '../../interface/list-table';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../payments/shared/service/payment.service';
import { GridOptions } from 'ag-grid-community';

type Privileges = {
  search: boolean;
  filter: boolean;
};

type Actions = {
  [key: string]: boolean;
};

@Component({
  selector: 'app-ag-grid-table',
  templateUrl: './ag-grid-table.component.html',
  styleUrl: './ag-grid-table.component.css'
})
export class AgGridTableComponent implements OnInit {
  @Input() columns: ITableColumn[] = [];
  @Input() tableData: any[] = [];
  @Input() options: any = {};
  @Input() privilege: any = {};

  popupPosition: { top: string, right: string } = { top: '0', right: '45' };
  filterOptionSearchText: { [field: string]: string } = {};

  data: any[];
  privileges: any ;
  filterList: any = {};
  showActiveToggle: boolean = false;
  isLoading: boolean = true;  // Loading state
  isActiveFilter: boolean = true;
  privilegeAccess: any;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {

    }
    
    ngOnChanges(changes: SimpleChanges): void {
      if (changes.tableData && changes.tableData.currentValue) {
        this.data = this.tableData;
        console.log("total data",this.data)
        this.filterList = this.generateFilterListFromColumns(this.columns, this.tableData);
        this.applyFilterActive(); 
        this.isLoading = false; // Set loading to false after data change
      }
        console.log("privilege", this.privilege);
        this.privilegeAccess = this.privilege;
        console.log("priv access", this.privilegeAccess);
        this.privileges= this.mapActionsToPrivileges(this.privilegeAccess);
        console.log("privileges", this.privileges);
    }

  // Pagination
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];

  generateFilterListFromColumns(columns: ITableColumn[], data: any[]) {
    for (const column of columns) {
      this.filterList[column.field] = {
        values: this.getUniqueValues(data, column.field),
        selected: [],
        showOptions: false,
      };
    }
    return this.filterList;
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
    this.tableData = filteredData;
    console.log("table data", this.tableData);
    
  }

  getUniqueValues = (data, field) => {
    return Array.from(new Set(data.map(item => item[field]))); // Use Array.from to ensure it's an array
  };

  gridOptions: GridOptions = {
    onGridReady: (params) => {
      params.api.sizeColumnsToFit();
    }
  };

  mapActionsToPrivileges(actions: Actions): Privileges{
    return {
      search: actions.searchUser || actions.searchLicense || actions.searchAssetAllocation || actions.searchAssetMaintenance || actions.searchServiceRequest || actions.searchAsset || actions.searchActivity||actions.searchAssetTypeMaster||actions.searchDocumentMaster||actions.searchModule||actions.searchRole||actions.searchServiceRequestMaster||actions.searchSubModule||actions.searchLookupMaster|| false,
      filter: actions.filterUser || actions.filterLicense || actions.filterAssetAllocation || actions.filterAssetMaintenance || actions.filterAsset || actions.filterServiceRequest || false,
      // import: actions.importUser || actions.importLicense || actions.importAssetAllocation || actions.importAssetMaintenance || actions.importAsset || false,
      // export: actions.exportUser || actions.exportLicense || actions.exportAssetAllocation || actions.exportAssetMaintenance || actions.exportAsset || false,
      // add: actions.addUser || actions.addLicense || actions.addAssetAllocation || actions.addAssetMaintenance || actions.addAsset || false,
      // edit: actions.editUser || actions.editLicense || actions.editAssetAllocation || actions.editAssetMaintenance || actions.editAsset ||actions.editServiceRequest|| actions.editActivity||actions.editAssetTypeMaster||actions.editDocumentMaster||actions.editModule||actions.editRole||actions.editServiceRequestMaster||actions.editSubModule||actions.editLookupMaster||false,
      // status: actions.userStatus || actions.assetStatus || actions.licenseStatus || false,
      // qrcode:actions.qrcodeAsset||false,
      // view: actions.viewAsset ||actions.viewServiceRequest || false,
    };
  }
}
