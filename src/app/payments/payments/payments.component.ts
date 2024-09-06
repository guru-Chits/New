import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
import jsPDF from 'jspdf';
import { AuthService } from '../../shared/service/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  providers: [DatePipe]
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
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView:boolean=false

 passbookInstallmentData: any = {};
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: PaymentService,
    private staffService:StaffService,
    private chitService:ChitService,
    private authService:AuthService,
    private datePipe: DatePipe,
    private routeService:AreaService) { }

  ngOnInit(): void {

    this.paymentForm = this.formBuilder.group({
      date: ['', [Validators.required, this.validateCurrentDate]],
      serialNumber:  ['',[Validators.required]],
      receiptNumber:  ['',[Validators.required]],
      passbooknumber:  ['',[Validators.required]],
      groupId:  ['',[Validators.required]],
      amount:  ['',[Validators.required]],
      collectionType:  ['',[Validators.required]],
      subscriberId:  ['',[Validators.required]],
      subscriberName:  ['',[Validators.required]],
      // installmentNumber:  ['',[Validators.required]],
      installmentMonth:  ['',[Validators.required]],
      region:  ['',[Validators.required]],
      selectStaff: ['',[Validators.required]],
      chitAmount:['',[Validators.required]],
      cancelled:['',[Validators.required]],
      verified:['',Validators.required]
      },
      {
        validator: this.amountLessThanOrEqualChitAmount('amount', 'chitAmount') // Add custom validator here
      }
    );



      this.paymentForm.get('cancelled')?.setValue(false) 
      this.paymentForm.get('verified')?.setValue(false)

      this.paymentForm.get('passbooknumber').valueChanges.subscribe(passbooknumber => {
        console.log(passbooknumber);
        
        if (passbooknumber) {
          this.getSubByPassbookNo(passbooknumber);
        }
      });

      // this.paymentForm.get('date')?.valueChanges.subscribe((selectedDate: string) => {
      //   if (selectedDate) {
      //     const selectedMonth = new Date(selectedDate).toLocaleString('default', { month: 'long' });
      //      this.month=selectedMonth
      //      console.log(this.month);
      //      this.paymentForm.patchValue(
      //       {installmentMonth:  this.month,
      //         }
      //      )
      //   }
      // });

this.service.getTodayPayment().subscribe((data)=>{
  
  this.totalPayment=data
  this.serialNumberCounter=this.totalPayment.AllPayment.length+1
  console.log(this.serialNumberCounter);
  
})
//  this.staffService.getstaffAll().subscribe((data)=>{
//   this.staffs=data  
//  this.data=this.staffs.AllStaff.map((staffDetails,index)=>({
//   staffName:staffDetails.firstName
//  }))
//  })

this.staffs=sessionStorage.getItem('name')
this.staffs=this.staffs.replace(/"/g, ''); 
console.log(this.staffs);


 this.routeService.getrouteAll().subscribe((data)=>{
  this.routeData=data;
  console.log("kk",this.routeData)

  this.routes=this.routeData.AllRoute.map((routeDetails,index)=>({
    routeId: routeDetails?.routeId,  
    }))}) 
  }

  amountLessThanOrEqualChitAmount(amountKey: string, chitAmountKey: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const amount = formGroup.get(amountKey)?.value;
      const chitAmount = formGroup.get(chitAmountKey)?.value;

      if (amount && chitAmount && amount > chitAmount) {
        return { amountExceedsChitAmount: true }; // Validation error if amount > chitAmount
      }

      return null; // No error if validation passes
    };
  }

  getSubByPassbookNo(passbooknumber: string): void {
    this.chitService.getByPassbooNo(passbooknumber).subscribe(
      data => {
        if (data) {
          this.subDetail=data
          console.log(this.subDetail,"sub");
          const date=this.datePipe.transform(this.subDetail.auctionDate, 'dd-MMMM') || '';
          console.log("dare",date);
          

          let serialNumber = this.formatSerialNumber(this.serialNumberCounter);
          const subscriberDetails = this.subDetail.subscriberDetails;
          const receiptNumber = `${subscriberDetails.passbookNo}-${serialNumber}`;
          this.receiptNo=receiptNumber
          this.paymentForm.patchValue({
            groupId: this.subDetail.chitGroupId,
            subscriberId:  subscriberDetails.subscriberId,
            subscriberName:  subscriberDetails.firstName,
            collectionType:"Monthly",
            installmentMonth:date,
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

    pdf.save(`${this.receiptNo}.pdf`);
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