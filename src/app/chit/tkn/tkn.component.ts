import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { ChitService } from '../shared/service/chit.service';
import { group } from '@angular/animations';

@Component({
  selector: 'app-tkn',
  templateUrl: './tkn.component.html',
  styleUrl: './tkn.component.css'
})
export class TknComponent implements OnInit {
  tknForm: FormGroup;
  @Input() subscriber:any
  @Input() chitData:any
  groupId:string;
  walletBalance:any
  subDetails:any
 
  constructor(
    private fb: FormBuilder,
    private service: ChitService,
  ) {
  }
ngOnInit(): void {
  this.tknForm = this.fb.group({
    groupId: ['',[Validators.required]],
    walletBalance: ['',[Validators.required]],
    foremanCommision: ['',[Validators.required]],
    winnningBid: ['',[Validators.required]],
    prizedAmmount: ['',[Validators.required]],
    ticketId: ['',[Validators.required]],
    subscriberName: ['',[Validators.required]],
    passbookNumber: ['',[Validators.required]],
    auctionCycle: ['',[Validators.required]],
    isActive: [false]
  },
  {
    validator: this.amountLessThanOrEqualChitAmount('ticketId') // Add custom validator here
  }

);

  const isActive=this.tknForm.get('isActive')?.value;
  console.log(isActive);
  
  if (isActive) {
  
    this.tknForm.enable();
  } else {
    this.tknForm.disable();
    this.tknForm.get('isActive')?.enable();
  }
  // this.tknForm.get('isActive')?.valueChanges.subscribe(() => {
  //   console.log(this.tknForm.get('isActive')?.value);

  // });

  



  console.log(this.subscriber);
  console.log(this.chitData);

  const groupId=this.chitData?.chitGroupId
  
  this.tknForm.patchValue({
    walletBalance:this.subscriber,
    groupId: groupId,
    foremanCommision: this.chitData?.foremanCommission,
  })

  this.tknForm.get('ticketId')?.valueChanges.subscribe(() => {
    const ticketId = this.tknForm.get('ticketId')?.value;

    if (ticketId && groupId) {
      this.service.getSubscriberByTicketId(ticketId, groupId).subscribe((details) => {
        console.log(details);
        this.subDetails=details
        console.log(this.subDetails);
        
        this.tknForm.patchValue({
          subscriberName: `${this.subDetails.chitDetails.firstName} ${this.subDetails.chitDetails.aliasName}`,
          passbookNumber: this.subDetails.chitDetails.passbookNo,
         
        });
      });
    }

})

this.tknForm.get('prizedAmmount')?.valueChanges.subscribe(()=>{
  const prizedAmount=this.tknForm.get('prizedAmmount').value
  const winnningBid=this.chitData?.chitAmount-prizedAmount
  this.tknForm.patchValue({
    winnningBid:winnningBid   
  });
})
console.log(groupId);

// if(groupId){
//   this.service.getAuctionCycleByGroupId(groupId).subscribe((data) => {
//     const cycle = data
//     console.log('increased cycle', cycle)
//     this.tknForm.patchValue({
//       auctionCycle: `${cycle?.auctionCycle}`
//     })
//   })
// }

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

toggleFormControls(): void {
  const isActive = this.tknForm.get('isActive')?.value;
  if (isActive) {
    this.tknForm.enable();
  } else {
    this.tknForm.disable();
    // this.auctionForm.get('isActive')?.enable();
  }
}
onSubmit(){
  const payload = {
    groupId: this.tknForm.value.groupId,
    walletBalance: this.tknForm.value.walletBalance,
    TKNData: {
      foremanCommision:this.tknForm.value.foremanCommision,
      winnningBid:this.tknForm.value.winnningBid,
      prizedAmmount:this.tknForm.value.prizedAmmount,
      ticketId:this.tknForm.value.ticketId,
      subscriberName:this.tknForm.value.subscriberName,
      passbookNumber:this.tknForm.value.passbookNumber,
      isActive:this.tknForm.value.isActive,
      auctionCycle:this.tknForm.value.auctionCycle
  
    },
    foremanCommision: this.tknForm.value.foremanCommision,
    winnningBid:this.tknForm.value.winnningBid,
    prizedAmmount:this.tknForm.value.prizedAmmount,
}
  this.service.saveAuctionDetails(payload).subscribe((response:any) => {
    console.log(response);
  });

  this.tknForm.reset()

 }
}

