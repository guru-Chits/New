import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ITableColumn } from '../../shared/interface/list-table';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent  implements OnInit{

  search:boolean=true
  data: any[] = [];
  searchImg:string='assets/table/black search.svg'
filterImg:string='assets/table/black filter.svg'

  staffcolumn: ITableColumn[] = [
    {
      label: 'profileImageUrl',
      field: 'S No',
      filter:false,
    },
    {
      label: 'profileImageUrl',
      field: 'Role',
      filter:false,
    },
    {
      label: 'profileImageUrl',
      field: 'Description',
      filter:false,
    },
    {
      label: 'profileImageUrl',
      field: 'Action',
      filter:false,
    }
  ]

  reactiveForm: FormGroup

 ngOnInit(): void {
   this.reactiveForm = new FormGroup({
     staffCreate : new FormControl(null),
     description : new FormControl(null),
     rolename : new FormControl(null)
   })
 }

}
