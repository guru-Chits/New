import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChitService } from '../chit/shared/service/chit.service';
import { PaymentService } from '../payments/shared/service/payment.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.css',

})
export class LedgerComponent implements OnInit {
  ledgerForm: FormGroup;

  breadcrumsData: any = [
    {
      key: 'Ledger',
      routerLink: 'ledger',
    },
  ];
  chosenDate: string;
  chitdata: any;
  displayedChit: any[] = []
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  data: any[] = [];
  selectedIndex: string | null = null;
  groupPaymentData:any 

  constructor(private fb:FormBuilder, private chitService:ChitService, private paymentService:PaymentService){}
ngOnInit(): void {
  this.ledgerForm=this.fb.group({
    date:[]
  })
  this.chitService.getAllChit().subscribe((data) => {
    this.chitdata = data;
    this.chitdata = this.chitdata?.AllChitGroups

    this.displayedChit = this.chitdata;

    this.totalPages = Math.ceil(this.displayedChit.length / this.itemsPerPage);
  })
}

applyFilter(filterValue: string) {
  this.displayedChit = this.chitdata;
  if (!filterValue || !this.data) {
    return;
  }

  this.displayedChit = this.chitdata.filter(subscriber => {
    const groupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
    // const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
    return groupId.includes(filterValue.toLowerCase());
  });
}
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

// Move to the previous page
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

onChange(event:any){
console.log(event.target.value);
this.chosenDate=event.target.value

}
getByGroupId(groupId:string,index:any){
  console.log(groupId,index);


    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.groupPaymentData=null
    } else {
      this.selectedIndex = index;
      this.paymentService.getTotalByGroupId(groupId,this.chosenDate).subscribe(data=>{
        console.log(data);
        this.groupPaymentData=data.payments

      })
    }

}
}
