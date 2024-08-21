import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../shared/service/payment.service';
import { IPaymentForm } from '../shared/interface/payment-form';
import { ITableColumn } from '../../shared/interface/list-table';
import { CellClickedEvent } from 'ag-grid-community';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
import { StaffService } from '../../staff/shared/service/staff.service';
import { AreaService } from '../../area/shared/service/area.service';
import { ChitService } from '../../chit/shared/service/chit.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  receiptNo:string
  staffs: any
  routeData:any
  routes:any[]=[]
  staffData:any[]=[]
  receiptData: any = {};
  paymentForm: FormGroup
  paymentData: any = {};  
  subDetail:any
  data: any[] = [];
  paymentDetail:any
  totalPayment:any
  month:string
  accessPrivData: any;
  subscriberDetail:any
 serialNumberCounter:number;
 passbookInstallmentData: any = {};
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: PaymentService,
    private staffService:StaffService,
    private chitService:ChitService,
    private routeService:AreaService) { }

  ngOnInit(): void {

    this.paymentForm = this.formBuilder.group({
      date: ['', [Validators.required, this.validateCurrentDate]],
      serialNumber:  [''],
      receiptNumber:  [''],
      passbooknumber:  [''],
      groupId:  [''],
      amount:  ['',[Validators.required]],
      collectionType:  [''],
      subscriberId:  [''],
      subscriberName:  [''],
      installmentNumber:  [''],
      installmentMonth:  [''],
      region:  [''],
      selectStaff: [''],
      chitAmount:[''],
      });

      this.paymentForm.get('amount')?.valueChanges.subscribe((amount: number) => {
        // this.updateInstallmentForPassbook();
      });

      this.paymentForm.get('passbooknumber').valueChanges.subscribe(passbooknumber => {
        console.log(passbooknumber);
        
        if (passbooknumber) {
          this.getSubByPassbookNo(passbooknumber);
        }
      });

      this.paymentForm.get('date')?.valueChanges.subscribe((selectedDate: string) => {
        if (selectedDate) {
          const selectedMonth = new Date(selectedDate).toLocaleString('default', { month: 'long' });
           this.month=selectedMonth
           console.log(this.month
           );
           
        }
      });

this.service.getPaymentAll().subscribe((data)=>{
  
  this.totalPayment=data
  this.serialNumberCounter=this.totalPayment.AllPayment.length+1
  console.log(this.serialNumberCounter);
  
})
 this.staffService.getstaffAll().subscribe((data)=>{
  this.staffs=data  
 this.data=this.staffs.AllStaff.map((staffDetails,index)=>({
  staffName:staffDetails.firstName
 }))
 })

 this.routeService.getrouteAll().subscribe((data)=>{
  this.routeData=data;
  console.log("kk",this.routeData)

  this.routes=this.routeData.AllRoute.map((routeDetails,index)=>({
    routeId: routeDetails?.routeId,  
    }))}) }

  getSubByPassbookNo(passbooknumber: string): void {
    this.chitService.getByPassbooNo(passbooknumber).subscribe(
      data => {
        if (data) {
          this.subDetail=data
          let serialNumber = this.formatSerialNumber(this.serialNumberCounter);
          const subscriberDetails = this.subDetail.subscriberDetails;
          
          const receiptNumber = `${subscriberDetails.passbookNo}-${serialNumber}`;
          this.receiptNo=receiptNumber
          this.paymentForm.patchValue({
            groupId: this.subDetail.chitGroupId,
            subscriberId:  subscriberDetails.subscriberId,
            subscriberName:  subscriberDetails.firstName,
            collectionType:"online",
            // installmentNumber:  this.subDetail.installmentNumber,
            installmentMonth:  this.month,
            region:  subscriberDetails.place,
            // amount:  this.subDetail.amount,
            chitAmount:  this.subDetail.chitAmount,
            serialNumber: serialNumber,
            receiptNumber: receiptNumber,
            // selectStaff:  this.subDetail.selectStaff // Make sure this matches the staff field structure
          });
        }
      },
      error => {
        console.error('Error fetching payment details', error);
      }
    );
  }
  
  onSubmit(): void {
    const payload = this.paymentForm.value
    
    this.service.savePaymentDetails(payload).subscribe((response:any) => {
      this.receiptData = response.newPayment;
      console.log(response);
    });

    this.router.navigate(["/payment"]);
    this.paymentForm.reset()

}

validateCurrentDate(control: AbstractControl): { [key: string]: boolean } | null {
  const selectedDate = new Date(control.value).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);

  return selectedDate === today ? null : { invalidDate: true };
}


getPaymentById(id: string) {
  this.service.getPaymentById(id).subscribe(
    data => {
      this.paymentDetail = data;

      console.log(this.paymentDetail)
    },
    error => {
      console.error('Error fetching payment', error);
    }
  );
}
formatSerialNumber(number: number): string {
  return number.toString().padStart(3, '0');
}

// updateInstallmentForPassbook(): void {
//   const passbookNo = this.paymentForm.get('passbooknumber')?.value;
//   const amount = this.paymentForm.get('amount')?.value;
//   const currentMonth = this.paymentForm.get('installmentMonth')?.value;

//   if (!passbookNo || !amount || !currentMonth) {
//     return;
//   }

//   if (!this.passbookInstallmentData[passbookNo]) {
//     this.passbookInstallmentData[passbookNo] = {
//       totalAmountForMonth: 0,
//       installmentNumber: 1
//     };
//   }

//   const installmentData = this.passbookInstallmentData[passbookNo];

//   if (installmentData.currentMonth !== currentMonth) {
//     installmentData.currentMonth = currentMonth;
//     installmentData.totalAmountForMonth = 0;
//     installmentData.installmentNumber++; 
//   }

//   installmentData.totalAmountForMonth += amount;

//   if (installmentData.totalAmountForMonth >= `5000`) {
//     installmentData.installmentNumber++;
//     installmentData.totalAmountForMonth = 0; 
//   }
//   console.log( installmentData.installmentNumber);
  
//   this.paymentForm.patchValue({
//     installmentNumber: installmentData.installmentNumber
//   });
// }
downloadAsImage() {
  const element = document.getElementById('print-section');

  // Apply width to the element to preserve two-column layout in the canvas
  element.style.width = '700px';  // Adjust according to your modal's size

  html2canvas(element, {
    scale: 2, // Increase the scale to improve image quality
    useCORS: true,  // Enable cross-origin resource sharing if images are hosted externally
    allowTaint: true // Allow cross-origin images to be rendered into the canvas
  }).then((canvas) => {
    const link = document.createElement('a');
    link.download = this.receiptNo;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Reset the style after capturing the image to avoid layout issues on the page
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