import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';

@Component({
  selector: 'app-chit-create',
  templateUrl: './chit-create.component.html',
  styleUrl: './chit-create.component.css'
})
export class ChitCreateComponent {

  data : any[] = [];
  subscriberDetail:any;
  onSubmit(){

  }
  
  column: ITableColumn[] = [
    { label: 'Profile', field: '', sortable: false },
    { label: 'Ticket ID', field:'Ticket ID', sortable: true },
    { label: 'Name', field: 'Name', sortable: true },
    { label: 'Alias Name', field: 'Alias Name', sortable: true },
    { label: 'Place', field: 'Place', sortable: true },
    { label: 'Occupation', field: 'Occupation', sortable: true }
  ];
}
