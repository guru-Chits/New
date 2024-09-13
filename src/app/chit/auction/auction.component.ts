import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  auctionData:any = {};
  selectedTicketId:any
  searchImg: string = 'assets/table/black search.svg';
  filterImg: string = 'assets/table/black filter.svg';
  search: boolean = true;
  data: any[] = [];
  chitData: any;
  subscribers: any[] = [];
  addSubscribers: any[] = [];
  groupId:string;
  date:any
  time:any
  month:string
  year:number
  ticketId:string
  receipt:any 
  walletBalance:any
  chitSubscriberTotal = 0;
  addSubscriberTotal = 0;
  subDetails:any
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
  }
  onTicketIdChange(ticketId: string) {
    console.log("Ticket ID received from child:", ticketId);
    // You can now use the ticketId as needed
    this.selectedTicketId=ticketId
  }
  
  ngOnInit(): void {
    this.auctionForm = this.fb.group({
      groupId: ['',[Validators.required]],
      walletBalance: ['',[Validators.required]],
      foremanCommision: ['',[Validators.required]],
      winningBid: ['',[Validators.required]],
      prizedAmount: ['',[Validators.required]],
      ticketId: ['',[Validators.required]],
      subscriberName: ['',[Validators.required]],
      passbookNumber: ['',[Validators.required]],
      auctionCycle: ['',[Validators.required]],
      auctionStart: [false]
    });

    const auctionStart = this.auctionForm.get('auctionStart')?.value;
    if (auctionStart) {
      this.auctionForm.enable();
    } else {
      this.auctionForm.disable();
      this.auctionForm.get('auctionStart')?.enable();
    }
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
                      this.auctionForm.patchValue({
                        walletBalance:this.chitSubscriberTotal
                      })
                    });
                  });
                } else {
                  console.log(`Passbook number ${item.passbooknumber} is not verified.`);
                }
              });
            });
          });
        // const winningBid = this.auctionForm.get('winningBid')?.value;
        // const chitAm = this.chitData.chitAmount;
        // if (winningBid !== null && chitAm !== null){
        //   const prizedAmount = chitAm - winningBid;
        //   this.auctionForm.get('prizedAmount')?.setValue(prizedAmount, {emitEvent: false});
        // }
          
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

  }

  autofillForm(): void {
    const chitDetails = {
      groupId: this.chitData?.chitGroupId,
      foremanCommision: this.chitData?.foremanCommission,
    };
    this.incrementAuctionCycle()
    this.auctionForm.patchValue(chitDetails);

    this.auctionForm.get('ticketId')?.valueChanges.subscribe(() => {
      this.fetchSubscriberDetails();
    });
  }

  // incrementAuctionCycle(): void {
  //   this.auctionForm.get('auctionCycle')?.setValue(this.auctionCycle++);
  // }


  getRouteNameValue() {
    const winningBid = this.auctionForm.get('winningBid').value;
    const prizedAmount = `${this.chitData.chitAmount - winningBid}`
    console.log('minus value', prizedAmount)
    this.auctionForm.get('prizedAmount').patchValue(prizedAmount)
    // debugger;
    const finalprizedAmount = this.auctionForm.get('prizedAmount').value;
    const walletBalance = this.chitSubscriberTotal
    const sumOfTwo = Number(finalprizedAmount) + Number(this.chitData.foremanCommission);
    console.log('sum of Two', sumOfTwo)
    const finalWallet = `${walletBalance - sumOfTwo}`
    console.log('final value', finalWallet)
    this.auctionForm.get('walletBalance').patchValue(finalWallet)
  }

  fetchSubscriberDetails(): void {
    const ticketId = this.auctionForm.get('ticketId')?.value;
    const groupId = this.groupId;

    if (ticketId && groupId) {
      this.service.getSubscriberByTicketId(ticketId, groupId).subscribe((details: SubscriberDetails) => {
        console.log(details);
        this.subDetails=details
        
        this.auctionForm.patchValue({
          subscriberName: `${this.subDetails.chitDetails.firstName} ${this.subDetails.chitDetails.aliasName}`,
          passbookNumber: this.subDetails.chitDetails.passbookNo,
        });
      });
    }
  }

  incrementAuctionCycle(): void{
    // debugger
    const groupId=this.chitData?.chitGroupId;
    console.log(groupId);
    
    if(groupId){
      this.service.getAuctionCycleByGroupId(groupId).subscribe((data) => {
        const cycle = data
        console.log('increased cycle', cycle)
        this.auctionForm.patchValue({
          auctionCycle: `${cycle?.auctionCycle}`
        })
      })
    }
  }


  toggleFormControls(): void {
    const auctionStart = this.auctionForm.get('auctionStart')?.value;
    if (auctionStart) {
      this.auctionForm.enable();
    } else {
      this.auctionForm.disable();
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

  onSubmit(){
    const payload = this.auctionForm.value
    
    this.service.saveAuctionDetails(payload).subscribe((response:any) => {
      this.auctionData = response.data;
      console.log('auctionForm', this.auctionData)
      this.ticketId=this.auctionData.ticketId
     const createdAtDate = new Date(response.data.createdAt);
     this.date =createdAtDate.toISOString().split('T')[0]; // Formats the date
     this.time = createdAtDate.toLocaleTimeString();  // Formats the time
     this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
     this.year = createdAtDate.getFullYear();  // Year
 
     this.receipt={
      time:this.time,
      date:this.date,
      prizedAmount:response.data.prizedAmount,
      subscriberName:response.data.subscriberName,
      groupId:response.data.groupId,
      passbookNo:response.data.passbookNumber,
      foremanCommision:response.data.foremanCommision,
      walletBalance:response.data.walletBalance,
      auctionCycle:response.data.auctionCycle,
    }


    });

    // this.auctionForm.reset()
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

  downloadAsPDF() {
    const element = document.getElementById('print-section');
  
    // Set the width to ensure correct layout
    element.style.width = '700px';  // Adjust according to your modal's size
  
    html2canvas(element, {
      scale: 2, // Increase the scale to improve image quality
      useCORS: true,  // Enable cross-origin resource sharing if images are hosted externally
      allowTaint: true // Allow cross-origin images to be rendered into the canvas
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
  
      // Initialize jsPDF (Portrait orientation, Millimeters, A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      // Calculate the width and height to fit the content on A4 page size
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
  
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
      // pdf.save(`${this.auctionCycle}.pdf`);
      element.style.width = '';
    });
  }
  print() {
    const printContent = document.getElementById('print-section').innerHTML;
    const originalContent = document.body.innerHTML;
    console.log(originalContent);
    
    // Replace body content with modal content
    document.body.innerHTML = printContent;
  
    // Trigger print
    window.print();
  
    // Revert body content
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore state
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

