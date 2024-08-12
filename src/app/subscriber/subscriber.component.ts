import { Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { SubscriberService } from './shared/service/subscriber.service';
import {ITableColumn} from '../../app/shared/interface/list-table'
import { Router } from '@angular/router';

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
  constructor(
    private service:SubscriberService,
    private router:Router
  ) { }

  ngOnInit(): void {
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

        // aadharNumber: subscriberDetails?.aadharNumber,
        // aadharUrl: subscriberDetails?.aadharUrl,
        // accountNumber: subscriberDetails?.accountNumber,
        // aliasName: subscriberDetails?.aliasName,
        // area: subscriberDetails?.area,
        // bankName: subscriberDetails?.bankName,
        // chitpassbookNumber: subscriberDetails?.chitpassbookNumber,
        // contact: subscriberDetails?.contact,
        // createdAt: subscriberDetails?.createdAt,
        // dob: subscriberDetails?.dob,
        // firstName: subscriberDetails?.firstName,
        // gender: subscriberDetails?.gender,
        // ifsc: subscriberDetails?.ifsc,
        // lastName: subscriberDetails?.lastName,
        // nomineeAadhar: subscriberDetails?.nomineeAadhar,
        // nomineeAddress: subscriberDetails?.nomineeAddress,
        // nomineeDOB: subscriberDetails?.nomineeDOB,
        // nomineeGender: subscriberDetails?.nomineeGender,
        // nomineeName: subscriberDetails?.nomineeName,
        // nomineeOccupation: subscriberDetails?.nomineeOccupation,
        // nomineeRelationship: subscriberDetails?.nomineeRelationship,
        // panCardNumber: subscriberDetails?.panCardNumber,
        // panUrl: subscriberDetails?.panUrl,
        // passbookNumber: subscriberDetails?.passbookNumber,
        // passbookUrl: subscriberDetails?.passbookUrl,
        // referralClient: subscriberDetails?.referralClient,
        // ticketId: subscriberDetails?.ticketId,
        // updatedAt: subscriberDetails?.updatedAt,
        // upi_id: subscriberDetails?.upi_id
      }))
    })


  }
  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    const subscriberId = params.data.subscriberId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="35" height="35" style="border-radius: 50%; margin-right: 10px;">
        <span style="color: #50A1A5;">${subscriberId}</span>
      </div>
    `;
  }
  
  column: ITableColumn[] = [
    {
      label: 'profileImageUrl',
      field: 'Subscriber ID',
      filter:false,
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },

    { label: 'Display Name', field:'displayName', sortable: true,
      filter:false,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
     },
    { label: 'Route Id', field: 'routeId', sortable: true , filter:true,

      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
    { label: 'Occupation', field: 'occupation', sortable: true ,  filter:true,
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
