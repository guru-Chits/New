import { Component,OnInit } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
import { Router ,ActivatedRoute } from '@angular/router';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
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
  groupId:string;
  walletBalance:any
  chitSubscriberTotal = 0;
  addSubscriberTotal = 0;
  canCreate: boolean = false;

  constructor(private activatedRoute:ActivatedRoute,private router:Router, private service: ChitService,private paymentService:PaymentService,private authService:AuthService){}

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
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate=true
      }
    })
    this.activatedRoute?.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
      this.service.getChitById(paramData.id).subscribe((data) => {
        this.chitData = data;
        this.chitData=this.chitData.ChitsGroup;
        this.groupId=this.chitData.chitGroupId;

        console.log(this.chitData.addChitSubscribers);
        
        this.paymentService.getTotalByGroupId(this.groupId).subscribe((data: any) => {
          console.log('Passbook Totals:', data.passbookTotals);
        
        
          // Iterate over each passbook number from the group total data
          data.passbookTotals.forEach((item: any) => {
            // Verify passbook number
            this.paymentService.verifyPassbookNo(item.passbooknumber).subscribe((verifiedpb: any) => {
              console.log('Verified Passbook:', verifiedpb);
        
              if (verifiedpb.verified) {
                // Fetch payment details for the passbook
                this.paymentService.getPaymentByPassbook(item.passbooknumber).subscribe((responseData: any) => {
                  console.log('Payments for Passbook:', responseData.payments);
        
                  // Check if passbook belongs to chitSubscribers or addChitSubscribers
                  this.service.getByPassbooNo(item.passbooknumber).subscribe((passbookData: any) => {
                    if (passbookData.source === 'chitSubscribers') {
                      // Sum up payments for chitSubscribers (convert amount to number explicitly)
                      const chitSubTotal = responseData.payments.reduce((acc: number, payment: any) => acc + Number(payment.amount), 0);
                      this.chitSubscriberTotal += chitSubTotal;
                    } else if (passbookData.source === 'addChitSubscribers') {
                      // Sum up payments for addChitSubscribers (convert amount to number explicitly)
                      const addSubTotal = responseData.payments.reduce((acc: number, payment: any) => acc + Number(payment.amount), 0);
                      this.addSubscriberTotal += addSubTotal;
                    }
        
                    // Log the totals (or use these totals to update the UI)
                    console.log('Chit Subscriber Total:', this.chitSubscriberTotal);
                    console.log('Add Subscriber Total:', this.addSubscriberTotal);
                  });
                });
              } else {
                console.log(`Passbook number ${item.passbooknumber} is not verified.`);
              }
            });
          });
        });
        
        

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
          place: subscriber.place,
          occupation: subscriber.occupation,
          subscriberId:subscriber.subscriberId,
          ticketId:subscriber.ticketId,
          profileImageUrl:subscriber.profileImageUrl

        }));
  
        const addSubscriberDetails =  this.addSubscribers.map(subscriber => ({
          aliasName: subscriber.aliasName,
          firstName: subscriber.firstName,
          passbookNo:subscriber.passbookNo,
          place: subscriber.place,
          occupation: subscriber.occupation,
          subscriberId:subscriber.subscriberId,
          ticketId:subscriber.ticketId,
          profileImageUrl:subscriber.profileImageUrl

        }));
  
        console.log('Subscriber Details:', subscriberDetails);
        console.log('Additional Subscriber Details:', addSubscriberDetails);
  });
}
});


  }
  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    const ticketId = params.data.ticketId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="35" height="35" style="border-radius: 50%; margin-right: 10px;">
        <span style="color: #50A1A5;">${ticketId}</span>
      </div>
    `;
  }
  
  subscriberColumn : ITableColumn[]= [
    {
      label: 'profileImageUrl',
      field: 'Ticket ID',
      filter:false,
      cellRenderer: this.profileImageWithIdRenderer,
    },  { label: 'Name', field: 'firstName' },
  { label: 'Alias Name', field: 'aliasName' },
  { label: 'Passbook Number', field: 'passbookNo' },
  { label: 'Place', field: 'place' },
  { label: 'Occupation', field: 'occupation' },

];

// Column definitions for addChitSubscribers
  addSubscriberColumn = [
    {
      label: 'profileImageUrl',
      field: 'Ticket ID',
      filter:false,
      cellRenderer: this.profileImageWithIdRenderer,
    },  { label: 'Name', field: 'firstName' },
  { label: 'Alias Name', field: 'aliasName' },
  { label: 'Passbook Number', field: 'passbookNo' },
  { label: 'Place', field: 'place' },
  { label: 'Occupation', field: 'occupation' },


  ]
}
