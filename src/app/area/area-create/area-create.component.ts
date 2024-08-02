import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColDef } from 'ag-grid-community/dist/types/core/entities/colDef';

@Component({
  selector: 'app-area-create',
  templateUrl: './area-create.component.html',
  styleUrl: './area-create.component.css'
})
export class AreaCreateComponent implements OnInit{
  regionForm : FormGroup
  ngOnInit(): void{
    this.regionForm = new FormGroup({
      regionId: new FormControl(null),
      regionName: new FormControl(null),
      routeId: new FormControl(null),
      routeDescripotion: new FormControl(null),
    })
    
  }
 
  columns: ColDef[] = [
    { field: 'sno', headerName: 'S No.', sortable: true },
    { field: 'routeId', headerName: 'Route ID', sortable: true },
    { field: 'regionName', headerName: 'Region Name', sortable: true },
    { field: 'routeName', headerName: 'Route Name', sortable: true },
    { field: 'status', headerName: '', sortable: true }
  ];

  rowData = [
    { sno: '1', routeId: 'CMB', regionName: 'Coimbatora', routeName: "Gandhipuram", status: 'View Details' },
    { sno: '2', routeId: 'CHN', regionName: 'Chennai', routeName: "Gandhipuram", status: 'View Details' },
    { sno: '3', routeId: 'BNG', regionName: 'Banglore', routeName: "Gandhipuram", status: 'View Details' },
    { sno: '4', routeId: 'MAD', regionName: 'Madurai', routeName: "Gandhipuram", status: 'View Details' },
    { sno: '5', routeId: 'TRY', regionName: 'Trichy', routeName: "Gandhipuram", status: 'View Details' },
    { sno: '6', routeId: 'TVL', regionName: 'Tirunelveli', routeName: "Gandhipuram", status: 'View Details' },
    { sno: '7', routeId: 'THU', regionName: 'Thoothukudi', routeName: "Gandhipuram", status: 'View Details' },

 ]
}
