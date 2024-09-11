import { Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { SubscriberService } from './shared/service/subscriber.service';
import {ITableColumn} from '../../app/shared/interface/list-table'
import { Router } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrl: './subscriber.component.css'
})
export class SubscriberComponent {
  
  breadcrumsData: any = [
    {
      key: 'Subscriber Management',
      routerLink: 'subscriber',
    },
  ];

subscriberData:any
data: any[] = [];
selectedId:any
subscriberDetail:any
totalCount:number;
searchImg:string='assets/table/search.svg'
filterImg:string='assets/table/filter.svg'
search:boolean=true
canCreate: boolean = false;
canEdit: boolean = false;
canDelete: boolean = false;
canView:boolean=false
  constructor(
    private service:SubscriberService,
    private router:Router,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
// Assuming you are calling checkAccess in your component
this.authService.checkAccess('Subscriber Management', 'create').subscribe((hasAccess: boolean) => {
  if (hasAccess) {
    this.canCreate=true
    // Code to execute when access is granted
    console.log('Create access granted');
  } else {
    // Code to execute when access is denied
    console.log('Create access denied');
  }
});



this.authService.checkAccess('Subscriber Management', 'view').subscribe((hasAccess: boolean) => {
  if (hasAccess) {
    this.canView=true
    console.log('Delete access granted');
  } else {
    console.log('Delete access denied');
  }
});

this.authService.checkAccess('Subscriber Management', 'delete').subscribe((hasAccess: boolean) => {
  if (hasAccess) {
    this.canDelete=true
    console.log('Delete access granted');
  } else {
    console.log('Delete access denied');
  }
});
  

      console.log("subscriber data");
      
      this.service.getsubscriberAll().subscribe((data)=>{
      this.subscriberData=data;

      console.log("subscriber data",this.subscriberData);
      console.log(this.subscriberData.AllSubscriber.length);
      this.totalCount=this.subscriberData.AllSubscriber.length
      this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
        id:subscriberDetails?._id,
        displayName: `${subscriberDetails?.firstName} ${subscriberDetails?.aliasName}`,
        occupation: subscriberDetails?.occupation,
        subscriberId: subscriberDetails?.subscriberId,
        location: subscriberDetails?.place,
        profileImageUrl: subscriberDetails?.profileImageUrl,
        routeId: subscriberDetails?.routeId,

      }))
    })


  }
  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    // const subscriberId = params.data.subscriberId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="32" height="32" style="border-radius: 50%; ">
      </div>
    `;
  }
  
  column: ITableColumn[] = [
    {
      label: ' ',
      field: ' ',
      filterList:false,
      maxWidth:80,  
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },
    {
      label: 'Subscriber ID',
      field: 'subscriberId',
      sortable:true,
      filterList:false,
      cellStyle: function (params: any) {
        return { color: '#50A1A5' ,cursor:'pointer'};
      }, 
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },

    { label: 'Display Name', field:'displayName', sortable: true,
      filterList:false,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
     },
    { label: 'Route ID', field: 'routeId', sortable: true , filterList:true,

      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
    { label: 'Occupation', field: 'occupation', sortable: true ,  filterList:true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
  ];

  getSubscriberById(id: string): void {
    this.service.getsubscriberById(id).subscribe(
      data => {
        this.subscriberDetail = data;
  
        console.log(this.subscriberDetail)
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
  }
  navigate(id: any){
    this.router.navigate([`subscriber/view/${id}`]);
  }

}
