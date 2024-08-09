import { Component } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
@Component({
  selector: 'app-chit-view',
  templateUrl: './chit-view.component.html',
  styleUrl: './chit-view.component.css'
})
export class ChitViewComponent {
  data: any[] = [];


  column: ITableColumn[] = [
    { label: 'Profile', field: '', sortable: false },
    { label: 'Ticket ID', field:'Ticket ID', sortable: true },
    { label: 'Name', field: 'Name', sortable: true },
    { label: 'Alias Name', field: 'Alias Name', sortable: true },
    { label: 'Place', field: 'Place', sortable: true },
    { label: 'Occupation', field: 'Occupation', sortable: true }
  ];
}
