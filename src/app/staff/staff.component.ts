import { Component, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { StaffService } from './shared/service/staff.service';
import { Router } from '@angular/router';
import { ITableColumn } from '../shared/interface/list-table';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit{
 staffData:any
  data: any[] = [];
  selectedId:any
 staffDetail:any
  totalCount:number;
  searchImg:string='assets/table/search.svg'
  filterImg:string='assets/table/filter.svg'
  search:boolean=true

    constructor(
      private service:StaffService,
      private router:Router
    ) { }
  ngOnInit(): void {
    this.service.getstaffAll().subscribe((data)=>{
      this.staffData=data;

      console.log("staff data",this.staffData);
      console.log(this.staffData.AllStaff);
      this.totalCount=this.staffData.AllStaff.length
      this.data=this.staffData.AllStaff.map((staffDetails,index)=>({
        id:staffDetails?._id,
        staffName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
        employeeId:staffDetails?.employeeId,
        firstName:staffDetails?.firstName,
        lastName:staffDetails?.lastName,
        role:staffDetails?.role
      }))
    })

  }

  column: ITableColumn[] = [
    { label: 'Employee ID', field: 'employeeId', sortable: false,  filter:false,

      cellStyle: function (params: any) {
        return { color: '#50A1A5' };
      },   
      onCellClicked: (event: CellClickedEvent) =>
      this.getStaffById(event.data.id)
          
     },

    { label: 'First Name', field:'firstName', sortable: true,  filter:false,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
     },
    { label: 'Last Name', field: 'lastName', sortable: true ,  filter:true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
    },
    { label: 'Role', field: 'role', sortable: true ,
      filter:true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getStaffById(event.data.id)
    },
  ];

  getStaffById(id: string): void {
    this.service.getstaffById(id).subscribe(
      data => {
        this.staffDetail = data;
  
        console.log(this.staffDetail)
      },
      error => {
        console.error('Error fetching staff', error);
      }
    );
  }
  navigate(id: any){
    this.router.navigate([`staff/view/${id}`]);
  }

}
