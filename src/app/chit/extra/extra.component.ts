import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.css'
})
export class ExtraComponent implements OnInit {
  extraForm : FormGroup;
  groupId:string;
  walletBalance:any
  data:any
  subDetails:any
  date:any
  time:any
  receipt:any
 month:string
 year:Number
  status:boolean=false
  constructor( private fb: FormBuilder,private service: ChitService,
  ){}
  @Input() subscriber:any
  @Input() chitData:any
  
  ngOnInit(): void {
    this.extraForm = this.fb.group({
      groupId: ['',[Validators.required]],
      walletBalance: ['',[Validators.required]],
      foremanCommision: ['',[Validators.required]],
      winnningBid: ['',[Validators.required]],
      prizedAmmount: ['',[Validators.required]],
      ticketId: ['',[Validators.required]],
      subscriberName: ['',[Validators.required]],
      passbookNumber: ['',[Validators.required]],
    },
    {
      validator: this.amountLessThanOrEqualChitAmount('ticketId') // Add custom validator here
    }
  );
  
    console.log(this.subscriber);
    console.log(this.chitData.chitSubscribers.length);
    
    const groupId=this.chitData?.chitGroupId
    
    this.extraForm.patchValue({
      walletBalance:this.subscriber,
      groupId: groupId,
      foremanCommision: this.chitData?.foremanCommission,
    })
  
    this.extraForm.get('ticketId')?.valueChanges.subscribe(() => {
      const ticketId = this.extraForm.get('ticketId')?.value;
  
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
  
  this.extraForm.get('prizedAmmount')?.valueChanges.subscribe(()=>{
    const prizedAmount=this.extraForm.get('prizedAmmount').value
    const winnningBid=this.chitData?.chitAmount-prizedAmount
    this.extraForm.patchValue({
      winnningBid:winnningBid   
    });
  })
}


amountLessThanOrEqualChitAmount(ticketIdControl: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const ticketId = formGroup.get(ticketIdControl)?.value;

    const maxLen = this.chitData.chitSubscribers.length + this.chitData.addChitSubscribers.length;
    const minLen = this.chitData.chitSubscribers.length;

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
        winnningBid:this.extraForm.value.winnningBid,
        prizedAmmount:this.extraForm.value.prizedAmmount,
        ticketId:this.extraForm.value.ticketId,
        subscriberName:this.extraForm.value.subscriberName,
        passbookNumber:this.extraForm.value.passbookNumber,
      },
      foremanCommision: this.extraForm.value.foremanCommision,
      winnningBid:this.extraForm.value.winnningBid,
      prizedAmmount:this.extraForm.value.prizedAmmount,
  }
    this.service.saveAuctionDetails(payload).subscribe((response:any) => {
      console.log(response);
      this.data=response.data
      if(response.success){
        console.log(response.data.extraPaymentData);
        console.log(response.data.createdAt);
        console.log(response.data.createdAt);
        const createdAtDate = new Date(response.data.createdAt);
        this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
        this.year = createdAtDate.getFullYear();  // Year
        this.date =createdAtDate.toISOString().split('T')[0]; // Formats the date
        this.time = createdAtDate.toLocaleTimeString();  // Formats the time
    
        this.receipt={
          time:this.time,
          date:this.date,
          prizedAmount:response.data.extraPaymentData.prizedAmmount,
          subscriberName:response.data.extraPaymentData.subscriberName,
          groupId:response.data.groupId,
          passbookNo:response.data.extraPaymentData.passbookNumber
        }
        this.extraForm.reset()
      }
      else{
        this.status=false
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
