import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-profit-chit',
  templateUrl: './profit-chit.component.html',
  styleUrl: './profit-chit.component.css'
})
export class ProfitChitComponent implements OnInit {
  profitForm:FormGroup;
  @Input() chitData:any
  groupId:string;
  walletBalance:any
  data:any
  subDetails:any
  date:any
  chitSubscriberTotal=0
  time:any
  receipt:any
  month:string
  year:Number
  purchase:boolean=false
  constructor(private formBuiler:FormBuilder,private paymentService:PaymentService 
,private service: ChitService, ){}
ngOnInit(): void {
  this.profitForm=this.formBuiler.group({
    groupId:['',[Validators.required]],
    walletBalance:['',[Validators.required]],
    foremanCommision:['',[Validators.required]],
    winningBid: ['',[Validators.required]],
    prizedAmount: ['',[Validators.required]],
    ticketId: ['',[Validators.required]],
    subscriberName: ['',[Validators.required]],
    passbookNumber: ['',[Validators.required]],
    auctionCycle: ['',[Validators.required]],
    auctionStart: [false]
  },{
    validator: this.amountLessThanOrEqualChitAmount('ticketId')  // Add custom validator here
  })
  const auctionStart = this.profitForm.get('auctionStart')?.value;
  if (auctionStart) {
    this.profitForm.enable();
    this.profitForm.get('auctionStart')?.enable();

  } else {
    this.profitForm.disable();
    this.profitForm.get('auctionStart')?.enable();
  }
  const groupId=this.chitData?.chitGroupId
  this.groupId=groupId
  console.log(groupId);
  const chitDetails = {
    groupId: this.chitData?.chitGroupId,
    foremanCommision: this.chitData?.foremanCommission,
  };
  this.incrementAuctionCycle()
  this.profitForm.patchValue(chitDetails);
  this.paymentService.getTransactionById(this.groupId).subscribe((response)=>{
    console.log(response);
    this.walletBalance=response
    this.walletBalance=this.walletBalance.payment
    this.walletBalance.forEach(amount => {
      this.chitSubscriberTotal=amount.walletBalance
      console.log(this.chitSubscriberTotal,"red");
      this.profitForm.patchValue({
        walletBalance:this.chitSubscriberTotal
      })  
    }); 
  })
  this.profitForm.patchValue({
    walletBalance:this.chitSubscriberTotal,
    groupId: groupId,
    foremanCommision: this.chitData?.foremanCommission,
  })
  this.profitForm.get('ticketId')?.valueChanges.subscribe(() => {
    const ticketId = this.profitForm.get('ticketId')?.value;
    this.service.findTicketInGroup(this.groupId,ticketId).subscribe((res)=>{
      console.log("res tickeer id",res.extra);
      if (res.extra===true) {
        // Set a validation error if the ticket already exists
        console.log('error');
        this.purchase=false

        this.profitForm.get('ticketId')?.setErrors({ ticketExists: true });
      }else if(res.purchase===true) {
        this.purchase=true
      }  
      else if (res.result === true) {
        // Set a validation error if the ticket already exists
        this.purchase=false

        this.profitForm.get('ticketId')?.setErrors({ ticketExists: true });

      }
      else {
        // Clear the validation error if the ticket does not exist
        this.purchase=false

        this.profitForm.get('ticketId')?.setErrors(null);
      }
  
      // You can call this after validation to handle other logic
      if (ticketId && this.groupId) {
        this.service.getSubscriberByTicketId(ticketId, this.groupId).subscribe((details) => {
          console.log(details);
          this.subDetails=details
          console.log(this.subDetails);
          
          this.profitForm.patchValue({
            subscriberName: `${this.subDetails.chitDetails.firstName} ${this.subDetails.chitDetails.aliasName}`,
            passbookNumber: this.subDetails.chitDetails.passbookNo,
           
          });
        });
      }
      })
})
    this.profitForm.get('winningBid')?.valueChanges.subscribe(()=>{
      const winningBid=this.profitForm.get('winningBid').value
      const prizedAmount=this.chitData?.chitAmount-winningBid
      const finalprizedAmount = this.profitForm.get('prizedAmount').value;
    const walletBalance = this.chitSubscriberTotal
    const sumOfTwo =prizedAmount+this.chitData.foremanCommission
    console.log('sum of Two', sumOfTwo)
    const finalWallet = this.chitSubscriberTotal - sumOfTwo
    console.log('final value', finalWallet)

    this.profitForm.patchValue({
        prizedAmount:prizedAmount,
        walletBalance: finalWallet
      });
    }) 

}
amountLessThanOrEqualChitAmount(ticketIdControl: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const ticketId = formGroup.get(ticketIdControl)?.value;

    const maxLen = 20
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

incrementAuctionCycle(): void{
  // debugger
  const groupId=this.chitData?.chitGroupId;
  console.log(groupId);
  
  if(groupId){
    this.service.getAuctionCycleByGroupId(groupId).subscribe((data) => {
      const cycle = data
      console.log('increased cycle', cycle)
      this.profitForm.patchValue({
        auctionCycle: `${cycle?.auctionCycle}`
      })
    })
  }
}

toggleFormControls(){
  const auctionStart = this.profitForm.get('auctionStart')?.value;
  if (auctionStart) {
    this.profitForm.enable();
  } else {
    this.profitForm.disable();
    this.profitForm.get('auctionStart')?.enable();
  }

}
onSubmit(){
  const payload = {
    groupId: this.profitForm.value.groupId,
    walletBalance: this.profitForm.value.walletBalance,
    auctionCycle: this.profitForm.value.auctionCycle,

    profitChitData: {
      foremanCommision:this.profitForm.value.foremanCommision,
      winningBid:this.profitForm.value.winningBid,
      prizedAmount:this.profitForm.value.prizedAmount,
      ticketId:this.profitForm.value.ticketId,
      subscriberName:this.profitForm.value.subscriberName,
      passbookNumber:this.profitForm.value.passbookNumber,
    },
}
  this.service.saveAuctionDetails(payload).subscribe((response:any) => {
    console.log(response);
    this.data=response.data
    this.profitForm.reset()
      const createdAtDate = new Date(response.data.createdAt);
      this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
      this.year = createdAtDate.getFullYear();  // Year
      this.date =createdAtDate.toISOString().split('T')[0]; // Formats the date
      this.time = createdAtDate.toLocaleTimeString();  // Formats the time
      const walletBalance=response.data.profitChitData.prizedAmount+response.data.profitChitData.foremanCommision
      this.paymentService.saveTransactionDetails(response.data.groupId,-walletBalance ).subscribe(
        (response)=>{
          console.log(response);
          this.incrementAuctionCycle()
          this.paymentService.getTransactionById(this.groupId).subscribe((response)=>{
            console.log(response);
            this.walletBalance=response
            this.walletBalance=this.walletBalance.payment
            this.walletBalance.forEach(amount => {
              this.chitSubscriberTotal=amount.walletBalance
              console.log(this.chitSubscriberTotal,"red");
              this.profitForm.patchValue({
                walletBalance:this.chitSubscriberTotal
              })  
            }); 
          })
          this.profitForm.patchValue({
            
            ticketId: '',
            subscriberName: '',
            passbookNumber: '',
            auctionStart: false,  // or whatever the default value is
            winningBid: '',
            prizedAmount: ''
          });
        }
      )
      this.receipt={
        time:this.time,
        date:this.date,
        prizedAmount:response.data.profitChitData.prizedAmount,
        subscriberName:response.data.profitChitData.subscriberName,
        groupId:response.data.groupId,
        passbookNo:response.data.profitChitData.passbookNumber,
        winningBid:response.data.profitChitData.winningBid
      }
      console.log(this.receipt,"receipt");
      });
      this.purchase=false
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
}
