import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceService } from '../shared/service.service';
import { CellClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-reason-deletion',
  templateUrl: './reason-deletion.component.html',
  styleUrl: './reason-deletion.component.css'
})
export class ReasonDeletionComponent implements OnInit{

  search:boolean=true
  data: any[] = [];
  id:string
  colData:any
  searchImg:string='assets/table/black search.svg'
filterImg:string='assets/table/black filter.svg'
constructor(private service:ServiceService){}
reactiveForm:FormGroup
reasonData:any
ngOnInit(): void {
  this.reactiveForm = new FormGroup({
    deleteType : new FormControl(null),
    deleteDescription : new FormControl(null),
  })

  this.service.getAllReason().subscribe((data)=>{
    this.reasonData=data
    this.reasonData=this.reasonData.res

    this.data=this.reasonData.map((reasonData,index)=>({
    sNo:index+1,
    id:reasonData._id,
    Reason:reasonData.deleteType,
    deleteDescription:reasonData.deleteDescription,
    action:"edit",
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
      label: 'Reason',
      field: 'Reason',
      filter:false,
    },
    {
      label: 'Reason Description',
      field: 'deleteDescription',
      filter:false,
    },
    {
      label: '',
      field: 'action',
      sortable:true,
      filterList:true,      
      cellStyle: { color: '#50A1A5' },
      onCellClicked:(event: CellClickedEvent)=>
        this.getById(event.data.id)
    },
    {
      label: 'delete',
      field: 'delete',
      filter:false,
      sortable:true,
      filterList:true,      
      cellStyle: { color: '#50A1A5' },
       onCellClicked:(event: CellClickedEvent)=>
        this.delete(event.data.id)
    },
   
  ]
  delete(id:any){
    this.service.deleteReason(id).subscribe((data)=>{
      console.log(data);
    })
  }
  getById(id:string){
    this.id=id
    this.service.getreasonById(id).subscribe((data)=>{
      console.log(data);
      this.colData=data
      this.reactiveForm.patchValue(this.colData.res)
    })
  }
  submit(){
    const payload=this.reactiveForm.value
    console.log(payload);
    console.log(this.id);

    this.service.reasonAdd(payload,this.id).subscribe((data)=>
  {
    console.log(data);
    
  }) 
  }
}

