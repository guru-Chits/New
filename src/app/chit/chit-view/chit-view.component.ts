import { Component,OnInit } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
import { Router ,ActivatedRoute } from '@angular/router';
import { ChitService } from '../shared/service/chit.service';
@Component({
  selector: 'app-chit-view',
  templateUrl: './chit-view.component.html',
  styleUrl: './chit-view.component.css'
})
export class ChitViewComponent implements OnInit{
  data: any[] = [];
  subscribers:any[]=[]
  addSubscribers:any[]=[]
  chitData:any;
  breadcrumsData: any = [];
  chitId:string="";
  totalChitData:any;  
  
  constructor(private activatedRoute:ActivatedRoute,private router:Router, private service: ChitService){}

  getAllChit(){
    this.service.getAllChit().subscribe((data)=>{
      this.totalChitData=data;
      // this.total = this.chitdata.AllChitGroups.chitSubscribers.length
      
      this.totalChitData=this.totalChitData?.AllChitGroups
      console.log(this.totalChitData)
    //   this.data=this.chitdata.AllChitGroups.map((chitDetails,index)=>({
    //     id:chitDetails._id,
       
    // }))
    // console.log("CHIT ID ===>",  this.chitdata.id)
    })
  }

  ngOnInit(): void {
    this.getAllChit()
    this.activatedRoute?.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
      this.service.getChitById(paramData.id).subscribe((data) => {
        this.chitData = data;
        this.chitData=this.chitData.ChitsGroup;
        
        console.log(this.chitData);
        this.breadcrumsData = [
          {
            key: 'Chit Management',
            routerLink: '/chit',
          },
          
          {
            key: 'Chit Group Details',
            routerLink: `chit/view/${paramData.id}`,
          },
        ];
    
        
        this.subscribers = this.chitData.chitSubscribers;
        this.addSubscribers = this.chitData.addChitSubscribers;
  
  
        // You can also store these values in separate arrays if needed
        const subscriberDetails = this.subscribers.map(subscriber => ({
          aliasName: subscriber.aliasName,
          firstName: subscriber.firstName,
          passbookNo:subscriber.passbookNo,
          // place: subscriber.place,
          // occupation: subscriber.occupation,
          subscriberId:subscriber.subscriberId
        }));
  
        const addSubscriberDetails =  this.addSubscribers.map(addSubscriber => ({
          aliasName: addSubscriber.aliasName,
          firstName: addSubscriber.firstName,
          passbookNo:addSubscriber.passbookNo,
          subscriberId:addSubscriber.subscriberId

        }));
  
        console.log('Subscriber Details:', subscriberDetails);
        console.log('Additional Subscriber Details:', addSubscriberDetails);
  
  
      // this.service.getsubscriberAll().subscribe((data)=>{
      //   this.subscriberData=data;
    
      //   console.log("subscriber data",this.subscriberData);
       
      //   this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
      //     id:subscriberDetails?._id,
      //     subscriberId: subscriberDetails?.subscriberId,
      //     subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
      //     subscriberProfile:subscriberDetails?.profileImageUrl
      //   }))
      //   this.displayedSubscribers = this.data;
      // })
});
}
});
  }

  // column: ITableColumn[] = [
  //   { label: 'Profile', field: '', sortable: false },
  //   { label: 'Ticket ID', field:'Ticket ID', sortable: true },
  //   { label: 'Name', field: 'Name', sortable: true },
  //   { label: 'Alias Name', field: 'Alias Name', sortable: true },
  //   { label: 'Place', field: 'Place', sortable: true },
  //   { label: 'Occupation', field: 'Occupation', sortable: true }
  // ];

  // Column definitions for chitSubscribers
  subscriberColumn : ITableColumn[]= [
  // { label: 'Subscriber ID', field: 'subscriberId' },
  { label: 'subscriber Id', field: 'SubscriberId' },
  { label: 'Name', field: 'firstName' },
  { label: 'Alias Name', field: 'aliasName' },
  { label: 'Passbook Number', field: 'passbookNo' },
  // { label: 'Occupation', field: 'occupation' },

];

// Column definitions for addChitSubscribers
  addSubscriberColumn = [
    { label: 'subscriber Id', field: 'SubscriberId' },
    { label: 'Name', field: 'firstName' },
    { label: 'Alias Name', field: 'aliasName' },
    { label: 'Passbook Number', field: 'passbookNo' },
    // { label: 'Occupation', field: 'occupation' },  
    ];

}
