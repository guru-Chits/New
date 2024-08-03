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
subscriberData:any
data: any[] = [];
selectedId:any
subscriberDetail:any
totalCount:number;
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
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.aliasName}`,
        aadharNumber: subscriberDetails?.aadharNumber,
        aadharUrl: subscriberDetails?.aadharUrl,
        accountNumber: subscriberDetails?.accountNumber,
        aliasName: subscriberDetails?.aliasName,
        area: subscriberDetails?.area,
        bankName: subscriberDetails?.bankName,
        chitpassbookNumber: subscriberDetails?.chitpassbookNumber,
        contact: subscriberDetails?.contact,
        createdAt: subscriberDetails?.createdAt,
        dob: subscriberDetails?.dob,
        firstName: subscriberDetails?.firstName,
        gender: subscriberDetails?.gender,
        ifsc: subscriberDetails?.ifsc,
        lastName: subscriberDetails?.lastName,
        nomineeAadhar: subscriberDetails?.nomineeAadhar,
        nomineeAddress: subscriberDetails?.nomineeAddress,
        nomineeDOB: subscriberDetails?.nomineeDOB,
        nomineeGender: subscriberDetails?.nomineeGender,
        nomineeName: subscriberDetails?.nomineeName,
        nomineeOccupation: subscriberDetails?.nomineeOccupation,
        nomineeRelationship: subscriberDetails?.nomineeRelationship,
        occupation: subscriberDetails?.occupation,
        panCardNumber: subscriberDetails?.panCardNumber,
        panUrl: subscriberDetails?.panUrl,
        passbookNumber: subscriberDetails?.passbookNumber,
        passbookUrl: subscriberDetails?.passbookUrl,
        place: subscriberDetails?.place,
        profileImageUrl: subscriberDetails?.profileImageUrl,
        referralClient: subscriberDetails?.referralClient,
        routeId: subscriberDetails?.routeId,
        subscriberId: subscriberDetails?.subscriberId,
        ticketId: subscriberDetails?.ticketId,
        updatedAt: subscriberDetails?.updatedAt,
        upi_id: subscriberDetails?.upi_id
      }))
    })


  }

  column: ITableColumn[] = [
    { label: 'Subscriber ID', field: 'subscriberId', sortable: false, 
      cellStyle: function (params: any) {
        return { color: '#50A1A5' };
      },   
      onCellClicked: (event: CellClickedEvent) =>
      // console.log('Cell was clicked',event.data.id)
      this.getSubscriberById(event.data.id)
     },

    { label: 'Display Name', field:'subscriberName', sortable: true },
    { label: 'Location', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true },
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

  hasSubscriber(){
     return this.subscriberDetail && this.subscriberDetail.length > 0;
  }
}
