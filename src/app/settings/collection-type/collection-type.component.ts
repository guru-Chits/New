import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ITableColumn } from '../../shared/interface/list-table';

@Component({
  selector: 'app-collection-type',
  templateUrl: './collection-type.component.html',
  styleUrl: './collection-type.component.css'
})
export class CollectionTypeComponent implements OnInit{

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
     collectionCreate : new FormControl(null),
     collectiondescription : new FormControl(null)
   })
 }

}

