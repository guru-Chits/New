import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-subscriber-create',
  templateUrl: './subscriber-create.component.html',
  styleUrl: './subscriber-create.component.css'
})
export class SubscriberCreateComponent {

  columns: ColDef[] = [
    { field: 'subscriberId', headerName: 'Subscriber ID', sortable: true },
    { field: 'displayName', headerName: 'Display Name', sortable: true },
    { field: 'location', headerName: 'Location', sortable: true },
    { field: 'occupation', headerName: 'Occupation', sortable: true }
  ];

  rowData = [
    { subscriberId: 'KNG-C10001', displayName: 'John Doe - Entrans', location: 'JP Nagar', occupation: 'Engineer' },
    { subscriberId: 'KNG-C10002', displayName: 'David - SRM Tech', location: 'CJI Nagar', occupation: 'Engineer' },
    { subscriberId: 'KNG-C10003', displayName: 'Durai - LG Travels', location: 'MB Nagar', occupation: 'Ooty Mist' },
    { subscriberId: 'KNG-C10004', displayName: 'Lawrence - KR Travels', location: 'MB Nagar', occupation: 'Ooty Mist' },
    { subscriberId: 'KNG-C10005', displayName: 'Ravikumar - KG Mines', location: 'MB Nagar', occupation: 'Ooty Mist' },
    { subscriberId: 'KNG-C10006', displayName: 'Anand - SRM Tech', location: 'Ooty Mist', occupation: 'Engineer' },
    { subscriberId: 'KNG-C10007', displayName: 'Sandhya - Cowrks', location: 'MB Nagar', occupation: 'Ooty Mist' },

  ];}
