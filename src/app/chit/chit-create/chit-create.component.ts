import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';

@Component({
  selector: 'app-chit-create',
  templateUrl: './chit-create.component.html',
  styleUrl: './chit-create.component.css'
})
export class ChitCreateComponent {

  data : any[] = [];
  subscriberDetail:any;
  subscriberData:any={}
  displayedSubscribers: any[];
  isSubscriberListVisible:boolean = false;

  constructor( private service:SubscriberService) {

  }
  onSubmit(){

  }
  ngOnInit(): void{
    this.service.getsubscriberAll().subscribe((data)=>{
      this.subscriberData=data;
      console.log("subscriber data",this.subscriberData);
     
      this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
        id:subscriberDetails?._id,
        subscriberId: subscriberDetails?.subscriberId,
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
        subscriberProfile:subscriberDetails?.profileImageUrl
      }))
      this.displayedSubscribers = this.data;
    })
  }
  column: ITableColumn[] = [
    { label: 'Profile', field: '', sortable: false },
    { label: 'Ticket ID', field:'Ticket ID', sortable: true },
    { label: 'Name', field: 'Name', sortable: true },
    { label: 'Alias Name', field: 'Alias Name', sortable: true },
    { label: 'Place', field: 'Place', sortable: true },
    { label: 'Occupation', field: 'Occupation', sortable: true }
  ];

  showSubscriberList(): void {
    this.isSubscriberListVisible = true;
  }
}
