import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChitService } from '../chit/shared/service/chit.service';
import { PaymentService } from '../payments/shared/service/payment.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.css',
  providers: [DatePipe]

})
export class LedgerComponent implements OnInit {
  ledgerForm: FormGroup;

  breadcrumsData: any = [
    {
      key: 'Ledger',
      routerLink: 'ledger',
    },
  ];
  payments:any
  chosenDate: string;
  chitdata: any;
  displayedChit: any[] = []
  adjustedAmount:number
  itemsPerPage: number = 15;
  currentPage: number = 1;
  totalPages: number = 0;
  data: any[] = [];
  selectedIndex: string | null = null;
  groupPaymentData:any 
  subShow:boolean=false
  totalAmount:number=0
  collectedAmount:number=0
  subPayment:any
  subscriber:any
  totalCollected:number
  total:number
  totalSurplus:number
  groupSurplus:number
  selectedSub:string | null = null;
  chitAmount:any
  constructor(private fb:FormBuilder, private chitService:ChitService, private paymentService:PaymentService,    private datePipe: DatePipe,
  ){}
ngOnInit(): void {
  this.ledgerForm=this.fb.group({
    date:[this.getCurrentMonth()]
  })
  this.chosenDate=this.getCurrentMonth()
  console.log(this.chosenDate);

  this.chitService.getAllChit().subscribe(async (data) => {
    this.chitdata = data;
    this.chitdata = this.chitdata?.AllChitGroups  
    const [chosenYear, chosenMonth] = this.chosenDate.split('-').map(Number);
    const chosenDateObj = new Date(chosenYear, chosenMonth ); // Months are 0-indexed
  
    const filteredPromises = this.chitdata.map(async (group: any) => {
      const [day, month, year] = group.auctionDate.split('-').map(Number); // Parse DD-MM-YYYY
      const auctionDateObj = new Date(year, month - 1, day); // Create a Date object
  
      // Skip groups with auctionDate > chosenDate
      if (auctionDateObj > chosenDateObj) {
        return null;
      }
  
      // Fetch auction cycle data
      const auctionCycleData = await this.chitService.getAuctionCycleByGroupId(group.chitGroupId).toPromise();
      const latestChit = auctionCycleData?.latestChit || [];
  
      if (latestChit.length >= 19) {
        const lastInstallmentDate = this.datePipe.transform(
          latestChit[latestChit.length - 1]?.date,
          'MMMM-yyyy'
        ); // Format to compare dates
        const installmentMonth = this.datePipe.transform(this.chosenDate, 'MMMM-yyyy');
        const installmentChosenDate = new Date(installmentMonth); 
        const lastInstallment = new Date(lastInstallmentDate);   
        
        if (installmentChosenDate  > lastInstallment) {
          return null;
        }
      }       
      return group; // Include this group
    });
    const filteredGroups = await Promise.all(filteredPromises);
    this.displayedChit = filteredGroups.filter((group) => group !== null);
    
     this.totalPages = Math.ceil(this.displayedChit.length / this.itemsPerPage);
     this.calculateTotal().then(() => {
      console.log('Total calculated:', this.total);
    });
  })

  this.paymentService.getTotalByGroupId(this.chosenDate).subscribe(data => {
    this.totalCollected=data.totalOfMonth
    this.totalSurplus=data.totalFutureAmount
    console.log(this.totalCollected);
  })
}


async calculateTotal() {
  this.total = 0;

  const totalPromises = this.displayedChit.map(async (chitGroup) => {
    const auctionCycleData = await this.chitService.getAuctionCycleByGroupId(chitGroup.chitGroupId).toPromise();
    const latestChit = auctionCycleData?.latestChit || [];
    const lastInstallmentDate = this.datePipe.transform(latestChit[latestChit.length - 1]?.date, 'MMMM-yyyy');
    const installmentMonth = this.datePipe.transform(this.chosenDate, 'MMMM-yyyy');

    if (latestChit.length >= 19 && lastInstallmentDate === installmentMonth) {
      const transactionData = await this.paymentService.getTransactionById(chitGroup.chitGroupId).toPromise();
      this.chitAmount  = transactionData
      this.chitAmount=this.chitAmount.payment
      const payments = this.chitAmount || [];
      const walletBalance = payments.reduce((sum, payment) => sum + (payment.walletBalance || 0), 0);

      const adjustedAmount = chitGroup.chitAmount - walletBalance;
      const subscribers = chitGroup.chitSubscribers?.length || 0;

      return (adjustedAmount / 20) * subscribers;
    // }else if(lastInstallmentDate === installmentMonth){
    //   const chitAmount =null
    //   const subscribers = chitGroup.chitSubscribers?.length || 0;

    //   return (chitAmount / 20) * subscribers;

    }
     else {
      const chitAmount = parseFloat(chitGroup.chitAmount) || 0;
      const subscribers = chitGroup.chitSubscribers?.length || 0;

      return (chitAmount / 20) * subscribers;
    }
  });

  const totalAmounts = await Promise.all(totalPromises);
  this.total = totalAmounts.reduce((sum, amount) => sum + amount, 0);
}
async calculateChitAmount(chitAmount: number, chitGroupId: string): Promise<number> {
  try {
    // Fetch auction cycle data for the group
    const auctionCycleData = await this.chitService.getAuctionCycleByGroupId(chitGroupId).toPromise();
    const latestChit = auctionCycleData?.latestChit || [];
    const lastInstallmentDate = this.datePipe.transform(latestChit[latestChit.length - 1]?.date, 'MMMM-yyyy');
    const installmentMonth = this.datePipe.transform(this.chosenDate, 'MMMM-yyyy');

    // Check condition: If auction cycle >= 19 and dates match
    if (latestChit.length >= 19 && lastInstallmentDate === installmentMonth) {
      // Fetch transactions for the group
      const transactionData = await this.paymentService.getTransactionById(chitGroupId).toPromise();
      this.payments=transactionData
      const payments=this.payments?.payment || []
      // Calculate wallet balance from payments
      const walletBalance = payments.reduce((sum, payment) => sum + (payment.walletBalance || 0), 0);

      // Calculate adjusted amount
      return chitAmount - walletBalance;
    }

    // Return the original chitAmount if condition does not apply
    return chitAmount;
  } catch (error) {
    console.error('Error calculating chit amount:', error);
    return chitAmount; // Fallback to the original chitAmount in case of error
  }
}

getCurrentMonth(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth() is zero-based
  return `${year}-${month.toString().padStart(2, '0')}`; // Format as YYYY-MM
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
    this.subShow=false

  }
}

// Move to the previous page
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.subShow=false

  }
}

  async onChange(event:any){
console.log(event.target.value);
this.chosenDate=event.target.value

const [chosenYear, chosenMonth] = this.chosenDate.split('-').map(Number);
const chosenDateObj = new Date(chosenYear, chosenMonth ); // Parse selectedDate

const filteredPromises = this.chitdata.map(async (group: any) => {
  const [day, month, year] = group.auctionDate.split('-').map(Number); // Parse DD-MM-YYYY
  const auctionDateObj = new Date(year, month - 1, day); // Create a Date object

  // Skip groups with auctionDate > chosenDate
  if (auctionDateObj > chosenDateObj) {
    return null;
  }

  // Fetch auction cycle data
  const auctionCycleData = await this.chitService.getAuctionCycleByGroupId(group.chitGroupId).toPromise();
  const latestChit = auctionCycleData?.latestChit || [];

  if (latestChit.length >= 19) {
    const lastInstallmentDate = this.datePipe.transform(
      latestChit[latestChit.length - 1]?.date,
      'MMMM-yyyy'
    ); // Format to compare dates
    const installmentMonth = this.datePipe.transform(this.chosenDate, 'MMMM-yyyy');
    const installmentChosenDate = new Date(installmentMonth); 
    const lastInstallment = new Date(lastInstallmentDate);   
    
    if (installmentChosenDate  > lastInstallment) {
      return null;
    }
  }       
  return group; // Include this group
});
const filteredGroups = await Promise.all(filteredPromises);
this.displayedChit = filteredGroups.filter((group) => group !== null);



this.subShow=false
this.selectedIndex=null
this.paymentService.getTotalByGroupId(this.chosenDate).subscribe(data => {
  if (this.chosenDate>=this.getCurrentMonth()) {
    console.log(this.totalSurplus);
    
    this.totalSurplus=data.totalFutureAmount 
  }else{
    this.totalSurplus=0
  }
  this.totalCollected=data.totalOfMonth
})


this.calculateTotal().then(() => {
  console.log('Total calculated:', this.total);
});
}

  async getByGroupId(groupId: string, index: any, chitSubscribers: any[] ,chitAmount:number) {
  this.adjustedAmount = await this.calculateChitAmount(chitAmount, groupId);
  this.totalAmount=this.adjustedAmount/20 *chitSubscribers.length
  

  this.subShow=false
  if (this.selectedIndex === index) {
    this.selectedIndex = null;
    this.groupPaymentData = null;
    this.collectedAmount=0
  } else {
    this.selectedIndex = index;

    this.paymentService.getTotalByGroupId(this.chosenDate,groupId).subscribe(data => {
      console.log(data);
      if (this.chosenDate>=this.getCurrentMonth()) {        
        this.groupSurplus=data.totalGroupAmount
      }else{
        this.groupSurplus=0
      }
      // Consolidate duplicate passbooks
      const consolidatedPayments = this.consolidatePayments(data.payments);

      // Match with chitSubscribers and set amounts for missing passbooks
      const processedData = this.processPayments(consolidatedPayments, chitSubscribers);

      // Assign the processed data to groupPaymentData
      this.groupPaymentData = processedData;
      this.collectedAmount = this.calculateTotalAmount(processedData);
      console.log(this.groupPaymentData);
      
    });
  }
}

/**
 * Consolidates payments with the same passbook number by summing their amounts.
 * @param payments - Array of payment objects.
 * @returns Consolidated array of payments.
 */
private consolidatePayments(payments: any[]): any[] {
  const paymentMap = new Map();

  payments.forEach(payment => {
    const passbookKey = payment.passbooknumber;

    if (paymentMap.has(passbookKey)) {
      const existingPayment = paymentMap.get(passbookKey);

      // Convert and sum amounts
      existingPayment.amount =Number(existingPayment.amount)+ Number(payment.amount || 0);
      // existingPayment.amountCollected += Number(payment.amountCollected || 0);
      // existingPayment.outstanding += Number(payment.outstanding || 0);
      existingPayment.totalPassbookNoAmount =payment.totalPassbookNoAmount 
    } else {
      // Initialize new entry
      paymentMap.set(passbookKey, { ...payment });

    }
  });

  return Array.from(paymentMap.values());
}

/**
 * Matches consolidated payments with chit subscribers and sets missing amounts to 0.
 * @param payments - Consolidated payments array.
 * @param chitSubscribers - Array of all subscribers.
 * @returns Processed array with amounts adjusted for missing passbooks.
 */
private processPayments(payments: any[], chitSubscribers: any[]): any[] {
  // Create a map for consolidated payments keyed by passbook number
  const paymentMap = new Map();
  
  payments.forEach(payment => {
    const passbookKey = payment.passbooknumber;
    
    if (paymentMap.has(passbookKey)) {
      const existingPayment = paymentMap.get(passbookKey);
      
      // Add amounts for the same passbook
      existingPayment.amount = Number(existingPayment.amount)+ Number(payment.amount);
      // existingPayment.amountCollected += Number(payment.amountCollected || 0);
      // existingPayment.outstanding += Number(payment.outstanding || 0);
      existingPayment.totalPassbookNoAmount = payment.totalPassbookNoAmount 
     ;
      
      paymentMap.set(passbookKey, existingPayment);
    } else {
      // Initialize new payment
      paymentMap.set(passbookKey, {
        ...payment,
        amount: payment.amount,
        // amountCollected: Number(payment.amountCollected || 0),
        // outstanding: Number(payment.outstanding || 0),
        totalPassbookNoAmount: payment.totalPassbookNoAmount
      });
    }
  });

  // Match with chitSubscribers and set missing passbook amounts to 0
  const result = chitSubscribers.map(subscriber => {
    const matchingPayment = paymentMap.get(subscriber.passbookNo);

    if (matchingPayment) {
      // Use the matching payment and sum amounts if already consolidated
      return {
        ...subscriber,
        ...matchingPayment
      };
    } else {
      // No matching payment, set amounts to 0
      return {
        ...subscriber,
        amount: 0,
        totalPassbookNoAmount:0
      };
    }
  });

  return result;
}

getSub(passbookNumber:string){
this.subShow=true
this.paymentService.getVerifiedPaymentByPassbook(passbookNumber).subscribe(response => {
console.log(response);
this.subPayment=response
this.subPayment=this.subPayment.payments
});
}

private calculateTotalAmount(payments: any[]): number {
  return payments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
}

getSubscriber(id:string,index:any)
{
  if(this.selectedSub==index){
    this.selectedSub=null
    this.subscriber=null
  }else{
    this.selectedSub=index
    console.log(id);
    this.paymentService.getPaymentById(id).subscribe(response=>{
    this.subscriber=response
    this.subscriber=this.subscriber.payment
  })
  }
}

  downloadAsPDF() {
    const element = document.getElementById('print-section');
    element.style.width = '700px';  // Adjust according to your modal's size

    html2canvas(element, {
      scale: 2, // Increase the scale to improve image quality
      useCORS: true,  // Enable cross-origin resource sharing if images are hosted externally
      allowTaint: true // Allow cross-origin images to be rendered into the canvas
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);

      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`${this.subscriber.receiptNumber}.pdf`);
      element.style.width = '';
    });
  }
  print() {
    const printContent = document.getElementById('print-section').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  }
}
