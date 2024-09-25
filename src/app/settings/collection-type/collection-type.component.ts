import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ITableColumn } from '../../shared/interface/list-table';
import { ServiceService } from '../shared/service.service';
import { CellClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-collection-type',
  templateUrl: './collection-type.component.html',
  styleUrl: './collection-type.component.css'
})
export class CollectionTypeComponent implements OnInit{

  search:boolean=true
  data: any[] = [];
  id:string
  colData:any
  searchImg:string='assets/table/black search.svg'
filterImg:string='assets/table/black filter.svg'
constructor(private service:ServiceService){}
  reactiveForm: FormGroup
  collectionData:any
 ngOnInit(): void {
   this.reactiveForm = new FormGroup({
    collectionType : new FormControl(null),
    collectionDescription : new FormControl(null)
   })

   this.service.getAllCollection().subscribe((data)=>{
    this.collectionData=data
    this.collectionData=this.collectionData.res

    this.data=this.collectionData.map((collectionData,index)=>({
     sNo:index+1,
     id:collectionData._id,
      collectionName:collectionData.collectionType,
      collectionDesc:collectionData.collectionDescription,
      action: "edit",
      delete:"delete"
    }))
   })
 }

 collectioncolumn: ITableColumn[] = [
  {
    label: 'S No',
    field: 'sNo',
    filter:false,
  },
  {
    label: 'Collection Name',
    field: 'collectionName',
    filter:false,
  },
  {
    label: 'Collection Description',
    field: 'collectionDesc',
    filter:false,
  },
  { label: '', field: 'action', sortable: true , 
    filterList:true,      
    cellStyle: { color: '#50A1A5' },

  onCellClicked: (event: CellClickedEvent) =>
  this.getById(event.data.id)
  
    },
    { label: 'delete', field: 'delete', sortable: true , filterList:true,      cellStyle: { color: '#50A1A5' },

    onCellClicked: (event: CellClickedEvent) =>
    this.delete(event.data.id)
  
      },
]
delete(id:any){

  this.service.deleteCollection(id).subscribe((data)=>{
console.log(data);

  })
}
getById(id:string){
this.id=id
  this.service.getCollectionById(id).subscribe((data)=>{
    console.log(data);
    this.colData=data
    this.reactiveForm.patchValue(this.colData.res)
  })
}
submit(){
  const payload=this.reactiveForm.value
  console.log(payload);
  console.log(this.id);
  
  this.service.collectionSave(payload,this.id).subscribe((data)=>{
    console.log(data);
  })

}
cancel(){
  this.reactiveForm.reset()
}

}

