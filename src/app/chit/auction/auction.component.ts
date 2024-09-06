import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';

interface SubscriberDetails {
  firstName: string;
  lastName: string;
  passbookNumber: string;
}

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  activeTab: string = 'regular'; // Default active tab
  auctionForm: FormGroup;
  searchImg: string = 'assets/table/black search.svg';
  filterImg: string = 'assets/table/black filter.svg';
  search: boolean = true;
  data: any[] = [];
  chitData: any;
  subscribers: any[] = [];
  addSubscribers: any[] = [];
  groupId:string;
  walletBalance:any
  chitSubscriberTotal = 0;
  addSubscriberTotal = 0;

  column: ITableColumn[] = [
    { field: 'Ticket Id', sortable: false, filter: false },
    { field: 'Name', sortable: false, filter: false },
    { field: 'Alias Name', sortable: false, filter: false },
    { field: 'Place', sortable: false, filter: false },
    { field: 'Occupation', sortable: false, filter: false },
  ];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: ChitService,
    private paymentService:PaymentService 
  ) {
    this.auctionForm = this.fb.group({
      groupId: [''],
      walletBal: [''],
      foreCommission: [''],
      winBid: [''],
      priAm: [''],
      ticketId: [''],
      prizedSubName: [''],
      passbookNumber: [''],
      auctionCycle: [''],
      auctionStart: [false]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramData => {
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

          this.autofillForm();
        });
      }
    });
    // this.toggleFormControls();
  }

  autofillForm(): void {
    const chitDetails = {
      groupId: this.chitData?.chitGroupId,
      walletBal: this.chitSubscriberTotal,
      foreCommission: this.chitData?.foremanCommission,
    };

    this.auctionForm.patchValue(chitDetails);
    this.registerValueChanges();

    this.auctionForm.get('ticketId')?.valueChanges.subscribe(() => {
      this.fetchSubscriberDetails();
    });
  }

  registerValueChanges(): void {
    this.auctionForm.get('walletBal')?.valueChanges.subscribe(() => {
      this.updateWinningBid();
    });

    this.auctionForm.get('priAm')?.valueChanges.subscribe(() => {
      this.updateWinningBid();
    });
  }

  updateWinningBid(): void {
    const walletBal = this.auctionForm.get('walletBal')?.value;
    const priAm = this.auctionForm.get('priAm')?.value;

    if (walletBal !== null && priAm !== null) {
      const winBid = walletBal - priAm;
      this.auctionForm.get('winBid')?.setValue(winBid, { emitEvent: false });
    }
  }

  // fetchSubscriberDetails(): void {
  //   const ticketId = this.auctionForm.get('ticketId')?.value;
  //   const groupId = this.auctionForm.get('groupId')?.value;

  //   if (ticketId) {
  //     this.service
  //       .getChitById(ticketId && groupId)
  //       .subscribe((details: SubscriberDetails) => {

  //         this.auctionForm.patchValue({
  //           prizedSubName: `${details.firstName} ${details.lastName}`,
  //           passbookNumber: details.passbookNumber,
  //         });
  //       });
  //   }
  // }

  fetchSubscriberDetails(): void {
    const ticketId = this.auctionForm.get('ticketId')?.value;
    const groupId = this.groupId;

    if (ticketId && groupId) {
      this.service.getSubscriberByTicketId(ticketId, groupId).subscribe((details: SubscriberDetails) => {
        this.auctionForm.patchValue({
          prizedSubName: `${details.firstName} ${details.lastName}`,
          passbookNumber: details.passbookNumber,
        });
      });
    }
  }

  toggleFormControls(): void {
    const auctionStart = this.auctionForm.get('auctionStart')?.value;
    if (auctionStart) {
      this.auctionForm.disable();
    } else {
      this.auctionForm.enable();
      // this.auctionForm.get('auctionStart')?.enable();
    }
  }

  // toggleFormControls(): void {
  //   const auctionStart = this.auctionForm.get('auctionStart')?.value;
  //   if (auctionStart) {
  //     this.auctionForm.disable();
  //     // this.auctionForm.get('auctionStart')?.enable();
  //   } else {
  //     this.auctionForm.enable();
  //   }
  // }

  selectTab(tabName: string) {
    this.activeTab = tabName;
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

