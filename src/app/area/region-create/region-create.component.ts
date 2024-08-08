import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-region-create',
  templateUrl: './region-create.component.html',
  styleUrl: './region-create.component.css'
})
export class RegionCreateComponent implements OnInit{
  regionForm : FormGroup
  breadcrumsData:any = [
    {
      key: 'Route Manager',
      routerLink: '/area',
    },
    {
      key: 'Create New Region',
      routerLink: 'area/regioncreate',
    },
  ];
  ngOnInit(): void{
    this.regionForm = new FormGroup({
      regionName: new FormControl(null),
      regionId: new FormControl(null),
      regionDescription: new FormControl(null),
    })
    
  }
 
  columns: ColDef[] = [
    { field: 'sno', headerName: 'S No.', sortable: true },
    { field: 'regionId', headerName: 'Region ID', sortable: true },
    { field: 'regionName', headerName: 'Region Name', sortable: true },
    { field: 'status', headerName: '', sortable: true }
  ];

  rowData = [
    { sno: '1', regionId: 'CMB', regionName: 'Coimbatora', status: 'View Details' },
    { sno: '2', regionId: 'CHN', regionName: 'Chennai', status: 'View Details' },
    { sno: '3', regionId: 'BNG', regionName: 'Banglore', status: 'View Details' },
    { sno: '4', regionId: 'MAD', regionName: 'Madurai', status: 'View Details' },
    { sno: '5', regionId: 'TRY', regionName: 'Trichy', status: 'View Details' },
    { sno: '6', regionId: 'TVL', regionName: 'Tirunelveli', status: 'View Details' },
    { sno: '7', regionId: 'THU', regionName: 'Thoothukudi', status: 'View Details' },

 ]
}
