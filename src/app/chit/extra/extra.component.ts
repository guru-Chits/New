import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaymentService } from '../../payments/shared/service/payment.service';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.css'
})
export class ExtraComponent implements OnInit {
  extraForm : FormGroup;
  groupId:string;
  addWalletBalance:any
  data:any
  subDetails:any
  date:any
  time:any
  receipt:any
  addSubscriberTotal = 0;

 month:string
 year:Number
  status:boolean=false
  constructor( private fb: FormBuilder,private paymentService:PaymentService,private service: ChitService,
  ){}
  @Input() chitData:any
  
  ngOnInit(): void {
    this.extraForm = this.fb.group({
      groupId: ['',[Validators.required]],
      walletBalance: ['',[Validators.required]],
      foremanCommision: ['',[Validators.required]],
      winningBid: ['',[Validators.required]],
      prizedAmount: ['',[Validators.required]],
      ticketId: ['',[Validators.required]],
      subscriberName: ['',[Validators.required]],
      passbookNumber: ['',[Validators.required]],
    },
    {
      validator: this.amountLessThanOrEqualChitAmount('ticketId') // Add custom validator here
    }
  );
  
  
    console.log(this.chitData.chitSubscribers.length);
    
    const groupId=this.chitData?.chitGroupId


    this.paymentService.getAddWallet(groupId).subscribe((response)=>{
      this.addWalletBalance=response
      this.addWalletBalance=this.addWalletBalance.payment
      console.log(this.addWalletBalance,"addwall");
      
      this.addWalletBalance.forEach(amount => {
        this.addSubscriberTotal=amount.addWalletBalance
        console.log(this.addSubscriberTotal,"red");
        this.extraForm.patchValue({
          walletBalance:this.addSubscriberTotal
        })  
      }); 
    })
    
    this.extraForm.patchValue({
      walletBalance:this.addSubscriberTotal,
      groupId: groupId,
      foremanCommision: this.chitData?.foremanCommission,
    })
  
    this.extraForm.get('ticketId')?.valueChanges.subscribe(() => {
      const ticketId = this.extraForm.get('ticketId')?.value;
      this.service.findTicketInGroup(groupId,ticketId).subscribe((res)=>{
        console.log(res);
        if (res.extra===true) {
          // Set a validation error if the ticket already exists
          console.log('error');
          
          this.extraForm.get('ticketId')?.setErrors({ ticketExists: true });
        } else {
          // Clear the validation error if the ticket does not exist
          this.extraForm.get('ticketId')?.setErrors(null);
        }
      if (ticketId && groupId) {
        this.service.getSubscriberByTicketId(ticketId, groupId).subscribe((details) => {
          console.log(details);
          this.subDetails=details
          console.log(this.subDetails);
          
          this.extraForm.patchValue({
            subscriberName: `${this.subDetails.chitDetails.firstName} ${this.subDetails.chitDetails.aliasName}`,
            passbookNumber: this.subDetails.chitDetails.passbookNo,
           
          });
        });
      }
    })
  })

  this.extraForm.get('winningBid')?.valueChanges.subscribe(()=>{
    const winningBid=this.extraForm.get('winningBid').value
    const prizedAmount=this.chitData?.chitAmount-winningBid
    const finalprizedAmount = this.extraForm.get('prizedAmount').value;
  const walletBalance = this.addSubscriberTotal
  const sumOfTwo =prizedAmount+this.chitData.foremanCommission
  console.log('sum of Two', sumOfTwo)
  const finalWallet = this.addSubscriberTotal - sumOfTwo
  console.log('final value', finalWallet)

  this.extraForm.patchValue({
      prizedAmount:prizedAmount,
      walletBalance: finalWallet
    });
  }) 

}


amountLessThanOrEqualChitAmount(ticketIdControl: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const ticketId = formGroup.get(ticketIdControl)?.value;

    const maxLen = this.chitData.chitSubscribers.length + this.chitData.addChitSubscribers.length;
    const minLen = this.chitData.chitSubscribers.length+1;

    // Check if ticketId is a number and falls between minLen and maxLen
    if (ticketId !== null && (ticketId < minLen || ticketId > maxLen)) {
      // Return validation error if the ticketId is out of range
      return { ticketIdOutOfRange: `Ticket ID must be between ${minLen} and ${maxLen}` };
    }

    // No error if validation passes
    return null;
  };
}

   getRouteNameValue(){
    
   }
  
   toggleFormControls(){
  
   }
   onSubmit(){
    const payload = {
      groupId: this.extraForm.value.groupId,
      walletBalance: this.extraForm.value.walletBalance,
      extraPaymentData: {
        foremanCommision:this.extraForm.value.foremanCommision,
        winningBid:this.extraForm.value.winningBid,
        prizedAmount:this.extraForm.value.prizedAmount,
        ticketId:this.extraForm.value.ticketId,
        subscriberName:this.extraForm.value.subscriberName,
        passbookNumber:this.extraForm.value.passbookNumber,
      },
  }
    this.service.saveAuctionDetails(payload).subscribe((response:any) => {
      console.log(response);
      this.data=response.data
      
        const createdAtDate = new Date(response.data.createdAt);
        this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
        this.year = createdAtDate.getFullYear();  // Year
        this.date =createdAtDate.toISOString().split('T')[0]; // Formats the date
        this.time = createdAtDate.toLocaleTimeString();  // Formats the time
        const walletBalance=response.data.extraPaymentData.prizedAmount+response.data.extraPaymentData.foremanCommision
        this.paymentService.addWallet(response.data.groupId,-walletBalance ).subscribe(
          (response)=>{
            console.log(response);
          }
        )
        this.receipt={
          time:this.time,
          date:this.date,
          prizedAmount:response.data.extraPaymentData.prizedAmount,
          subscriberName:response.data.extraPaymentData.subscriberName,
          groupId:response.data.groupId,
          passbookNo:response.data.extraPaymentData.passbookNumber,
          winningBid:response.data.extraPaymentData.winningBid
        }
        console.log(this.receipt,"receipt");
        this.addWalletBalance.forEach(amount => {
          this.addSubscriberTotal=amount.addWalletBalance
          console.log(this.addSubscriberTotal,"red");
          this.extraForm.patchValue({
            walletBalance:this.addSubscriberTotal
          })  
        });
  
        this.extraForm.patchValue({
          
          ticketId: '',
          subscriberName: '',
          passbookNumber: '',
          auctionStart: false,  // or whatever the default value is
          winningBid: '',
          prizedAmount: ''
        });
        
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
