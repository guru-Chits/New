import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {
  columns: ColDef[] = [
    { field: 'employeeId', headerName: 'Employee ID', sortable: true },
    { field: 'firstName', headerName: 'First Name', sortable: true },
    { field: 'lastName', headerName: 'Last Name', sortable: true },
    { field: 'role', headerName: 'Role', sortable: true }
  ];
  
  rowData = [
    {  employeeId: 'KNG-E001', firstName: 'John Doe', lastName: ' Doe', role: 'Casher' },
    {  employeeId: 'KNG-E002', firstName: 'David', lastName: 'Doe', role: 'Casher' },
    {  employeeId: 'KNG-E003', firstName: 'Durai ', lastName: 'Doe', role: 'Casher' },
    {  employeeId: 'KNG-E004', firstName: 'Lawrence', lastName: 'Doe', role: 'Casher' },
    {  employeeId: 'KNG-E005', firstName: 'Ravikumar', lastName: 'Doe', role: 'Casher' },
    {  employeeId: 'KNG-E006', firstName: 'Anand ', lastName: 'Doe', role: 'Casher' },
    {  employeeId: 'KNG-E007', firstName: 'Sandhya ', lastName: 'Doe', role: 'Casher' },
  
  ]

}
