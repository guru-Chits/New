import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reason-deletion',
  templateUrl: './reason-deletion.component.html',
  styleUrl: './reason-deletion.component.css'
})
export class ReasonDeletionComponent implements OnInit{

  search:boolean=true
  data: any[] = [];
  searchImg:string='assets/table/black search.svg'
filterImg:string='assets/table/black filter.svg'

  collectioncolumn: ITableColumn[] = [
    {
      label: 'profileImageUrl',
      field: 'S No',
      filter:false,
    },
    {
      label: 'profileImageUrl',
      field: 'Collection Name',
      filter:false,
    },
    {
      label: 'profileImageUrl',
      field: 'Collection Description',
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
     reasonCreate : new FormControl(null),
     reasondescription : new FormControl(null),
   })
 }

}

