import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import { SubscriberDetails } from '../shared/interface/chit';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaymentService } from '../../payments/shared/service/payment.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})

export class PurchaseComponent implements OnInit {
 purchaseForm : FormGroup;
 groupId:string;
 walletBalance:any
 subDetails:any
 date:any
 time:any
 month:string
 year:number
 ticketId:string
 receipt:any
 @Output() ticketIdChange = new EventEmitter<string>();
constructor(private paymentService:PaymentService, private fb: FormBuilder,private service: ChitService,
){}
 subscriber:any
@Input() chitData:any

 ngOnInit(): void {
  this.purchaseForm = this.fb.group({
    groupId: ['',[Validators.required]],
    walletBalance: ['',[Validators.required]],
    foremanCommision: ['',[Validators.required]],
    winningBid: ['',[Validators.required]],
    prizedAmount: ['',[Validators.required]],
    ticketId: ['',[Validators.required]],
    subscriberName: ['',[Validators.required]],
    passbookNumber: ['',[Validators.required]],
    // auctionCycle: ['',[Validators.required]],
    // isActive: [false]

  },  {
    validator: this.amountLessThanOrEqualChitAmount('ticketId') // Add custom validator here
  }
);

  console.log(this.subscriber);
  console.log(this.chitData);

  // const isActive=this.purchaseForm.get('isActive')?.value;
  // console.log(isActive);
  
  // if (isActive) {
  
  //   this.purchaseForm.enable();
  // } else {
  //   this.purchaseForm.disable();
  //   this.purchaseForm.get('isActive')?.enable();
  // }
  console.log("chitdata",this.chitData);
  this.groupId=this.chitData?.chitGroupId

  this.paymentService.getTransactionById(this.groupId).subscribe((response)=>{
    console.log(response);
    this.walletBalance=response
    this.walletBalance=this.walletBalance.payment
    this.walletBalance.forEach(amount => {
      this.subscriber=amount.walletBalance
      console.log(this.subscriber,"red");
      this.purchaseForm.patchValue({
        walletBalance:this.subscriber,
        groupId: this.groupId,
        foremanCommision: this.chitData?.foremanCommission,
      })
    }); 
  })

  // this.incrementAuctionCycle()

  this.purchaseForm.get('ticketId')?.valueChanges.subscribe(() => {
    const ticketId = this.purchaseForm.get('ticketId')?.value;
    this.service.findTicketInGroup(this.groupId,ticketId).subscribe((res)=>{
      console.log("res tickeer id",res.purchase);
      if (res.purchase===true) {
        // Set a validation error if the ticket already exists
        console.log('error');
        
        this.purchaseForm.get('ticketId')?.setErrors({ ticketExists: true });
      } else if (res.result === true) {
        // Set a validation error if the ticket already exists
        this.purchaseForm.get('ticketId')?.setErrors({ ticketExists: true });
      }
      else {
        // Clear the validation error if the ticket does not exist
        this.purchaseForm.get('ticketId')?.setErrors(null);
      }
  
      // You can call this after validation to handle other logic
      if (ticketId && this.groupId) {
        this.service.getSubscriberByTicketId(ticketId, this.groupId).subscribe((details) => {
          console.log(details);
          this.subDetails=details
          console.log(this.subDetails);
          
          this.purchaseForm.patchValue({
            subscriberName: `${this.subDetails.chitDetails.firstName} ${this.subDetails.chitDetails.aliasName}`,
            passbookNumber: this.subDetails.chitDetails.passbookNo,
           
          });
        });
      }
      })

})

this.purchaseForm.get('winningBid')?.valueChanges.subscribe(()=>{
  const winningBid=this.purchaseForm.get('winningBid').value
  const prizedAmount=this.chitData?.chitAmount-winningBid
  const finalprizedAmount = prizedAmount;
  const walletBalance = this.subscriber

  this.purchaseForm.patchValue({
    prizedAmount:prizedAmount,
    // walltetBalance: 
  });
})
 }

 incrementAuctionCycle(): void{
  // debugger
  const groupId=this.chitData?.chitGroupId;
  console.log(groupId);
  
  if(groupId){
    this.service.getAuctionCycleByGroupId(groupId).subscribe((data) => {
      const cycle = data
      console.log('increased cycle', cycle)
      this.purchaseForm.patchValue({
        auctionCycle: `${cycle?.auctionCycle}`
      })
    })
  }
}

 getRouteNameValue(){
    
 }

 amountLessThanOrEqualChitAmount(ticketIdControl: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const ticketId = formGroup.get(ticketIdControl)?.value;

    const maxLen = this.chitData.chitSubscribers.length
    const minLen = 1

    // Check if ticketId is a number and falls between minLen and maxLen
    if (ticketId !== null && (ticketId < minLen || ticketId > maxLen)) {
      // Return validation error if the ticketId is out of range
      return { ticketIdOutOfRange: `Ticket ID must be between ${minLen} and ${maxLen}` };
    }

    // No error if validation passes
    return null;
  };
}
// toggleFormControls(): void {
//   const isActive = this.purchaseForm.get('isActive')?.value;
//   if (isActive) {
//     this.purchaseForm.enable();
//   } else {
//     this.purchaseForm.disable();
//     // this.auctionForm.get('isActive')?.enable();
//   }
// }
 onSubmit(){
  const payload = {
    groupId: this.purchaseForm.value.groupId,
    walletBalance: this.purchaseForm.value.walletBalance,
    purchaseChitData: {
      foremanCommision:this.purchaseForm.value.foremanCommision,
      winningBid:this.purchaseForm.value.winningBid,
      prizedAmount:this.purchaseForm.value.prizedAmount,
      ticketId:this.purchaseForm.value.ticketId,
      subscriberName:this.purchaseForm.value.subscriberName,
      passbookNumber:this.purchaseForm.value.passbookNumber,
    },
}
  this.service.saveAuctionDetails(payload).subscribe((response:any) => {
    console.log(response.data.purchaseChitData);
    this.ticketId=response.data.purchaseChitData.ticketId
    this.ticketIdChange.emit(this.ticketId);
    console.log(response.data.createdAt);
    console.log(response.data.createdAt);
    const createdAtDate = new Date(response.data.createdAt);
    this.purchaseForm.reset()

    this.date =createdAtDate.toISOString().split('T')[0]; // Formats the date
    this.time = createdAtDate.toLocaleTimeString();  // Formats the time
    this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
    this.year = createdAtDate.getFullYear();  // Year

    this.receipt={
      time:this.time,
      date:this.date,
      prizedAmount:response.data.purchaseChitData.prizedAmount,
      subscriberName:response.data.purchaseChitData.subscriberName,
      groupId:response.data.groupId,
      passbookNo:response.data.purchaseChitData.passbookNumber,
      winningBid:response.data.purchaseChitData.winningBid
    }

    });

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

    pdf.save(`${this.receipt.subscriberName}.pdf`);
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

}


