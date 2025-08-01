import { Component, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { StaffService } from './shared/service/staff.service';
import { Router } from '@angular/router';
import { ITableColumn } from '../shared/interface/list-table';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {
  staffData: any
  data: any[] = [];
  selectedId: any
  staffDetail: any
  totalCount: number;
  status: string
  searchImg: string = 'assets/table/search.svg'
  filterImg: string = 'assets/table/filter.svg'
  search: boolean = true
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView: boolean = false
  filter: boolean = true
  breadcrumsData: any = [
    {
      key: 'Staffs',
      routerLink: 'staff',
    },
  ];

  constructor(
    private service: StaffService,
    private router: Router,
    private authService: AuthService

  ) { }
  ngOnInit(): void {
    this.authService.checkAccess('Staffs', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate = true
      } 
    });



    this.authService.checkAccess('Staffs', 'view').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canView = true
      } 
    });

    this.authService.checkAccess('Staffs', 'delete').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canDelete = true
      } 
    });


    this.service.getstaffAll().subscribe((data) => {
      this.staffData = data;
      this.totalCount = this.staffData.AllStaff.length
      this.data = this.staffData.AllStaff.map((staffDetails, index) => ({
        id: staffDetails?._id,
        staffName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
        employeeId: staffDetails?.employeeId,
        firstName: staffDetails?.firstName,
        lastName: staffDetails?.lastName,
        routeId: staffDetails?.routeId,
        role: staffDetails?.role,
        profileUrl: staffDetails?.profileUrl
      }))
    })
  }

  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileUrl;
    const staffName = params.data.firstName
    const firstLetter = staffName.charAt(0).toUpperCase(); // Get first letter
    return `
        <div style="
          width: 32px; height: 32px; 
          border-radius: 50%; 
          background-color: #007bff; 
          color: white; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          font-size: 14px; 
          font-weight: bold;
        ">
          ${firstLetter}
        </div>
      `;

    // return `
    //   <div style="display: flex; align-items: center;">
    //     <img src="${imageUrl}" alt="Profile Image" width="32" height="32" style="border-radius: 50%; margin-right: 10px;">
    //   </div>
    // `;
  }

  column: ITableColumn[] = [
    {
      label: ' ', field: ' ', sortable: false, filterList: false,
      cellRenderer: this.profileImageWithIdRenderer,
      maxWidth: 80,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
    },
    {
      label: 'Employee ID',
      field: 'employeeId',
      sortable: true,
      filterList: false,
      cellStyle: function (params: any) {
        return { color: '#50A1A5', cursor: 'pointer' };
      },
      onCellClicked: (event: CellClickedEvent) => this.getStaffById(event.data.id)
    },

    {
      label: 'First Name', field: 'firstName', sortable: true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
    },
    {
      label: 'Route Id', field: 'routeId', sortable: true, filterList: true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
    },
    {
      label: 'Role', field: 'role', sortable: true,
      filterList: true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
    },
  ];

  getStaffById(id: string): void {
    this.service.getstaffById(id).subscribe(
      data => {
        this.staffDetail = data;
        const workingStatus = this.staffDetail.Staff.workingStatus

        if (workingStatus == true) {
          this.status = "Active"
        } else if (workingStatus == false) {
          this.status = "InActive"
        }
      },
      error => {
      }
    );
  }
  navigate(id: any) {
    this.router.navigate([`staff/view/${id}`]);
  }
  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

}
