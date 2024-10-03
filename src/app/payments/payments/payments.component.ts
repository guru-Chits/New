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
  receiptNo:any
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
  year:number
  today: string = '';

  accessPrivData: any;
  subscriberDetail:any
  serialNumberCounter:number;
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView:boolean=false
  payments:any
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
      passbooknumber:  ['PB-',[Validators.required]],
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
      cancelled:[''],
      verified:[''],
      deleteReason: [""]
      },
      {
        validator: this.amountLessThanOrEqualChitAmount('amount', 'chitAmount') // Add custom validator here
      }
    );

    
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
      this.paymentForm.get('cancelled')?.setValue(false) 
      this.paymentForm.get('verified')?.setValue(false)

      this.paymentForm.get('passbooknumber').valueChanges.subscribe(passbooknumber => {
        console.log(passbooknumber);
        
        if (passbooknumber) {
          this.getSubByPassbookNo(passbooknumber);
        }
     

      this.paymentForm.get('amount')?.valueChanges.subscribe((amount) => {
        const chitAmount = this.paymentForm.get('chitAmount')?.value;
        if (chitAmount && amount > 0) {
          const expectedInstallmentAmount = chitAmount / 20;  // Monthly installment calculation
          
          this.handleAmountChange(amount, expectedInstallmentAmount,passbooknumber);
        }
      });

    });
      this.service.getTodayPayment().subscribe((data)=>{
        this.totalPayment=data
        this.serialNumberCounter=this.totalPayment.AllPayment.length+1
        console.log(this.serialNumberCounter);
      })

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

  onInputChange(event: any) {
    let inputValue = event.target.value;

    

    // Ensure the value starts with PB- and limit the length to 8 digits after the prefix
    if (!inputValue.startsWith('PB-')) {
      this.paymentForm.patchValue({
        passbooknumber: 'PB-'
      });
    }

    // Patch the value back to the form control

  }

  blockPrefix(event: any) {
    const inputValue = this.paymentForm.get('passbooknumber')?.value;

    if (event.target.selectionStart < 3 && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  getSubByPassbookNo(passbooknumber: string): void {
    this.chitService.getByPassbooNo(passbooknumber).subscribe(data => {
      if (data) {
        this.subDetail = data;
        const chitAmount = this.subDetail.chitAmount;
        const expectedAmountPerInstallment = chitAmount / 20; // Monthly installment calculation
        const date = this.datePipe.transform(this.subDetail.auctionDate, 'dd-MMMM') || '';
  
        this.service.getPaymentByPassbook(passbooknumber).subscribe(paymentData => {
          // Filter payments where cancelled is false
          this.paymentData=paymentData
          this.payments = (this.paymentData?.payments || []).filter(payment => !payment.cancelled);
  
          // Check if there is a previous non-cancelled payment, else set previousAmountPaid to 0
          const lastPayment = this.payments.length > 0 ? this.payments[this.payments.length - 1] : null;
          const previousAmountPaid = lastPayment ? lastPayment.amount || 0 : 0;
  
          // Set receipt number and serial number
          this.receiptNo = paymentData // Increment receipt number
          this.receiptNo = this.receiptNo ? this.receiptNo.receiptNo + 1 : 1; // Increment receipt number

          console.log(this.receiptNo);
  
          let serialNumber = this.formatSerialNumber(this.serialNumberCounter);
  
          // Handle previous pending payments or no previous payments
          let balanceAmount = 0;
          let nextInstallmentMonth = date;
  
          if (previousAmountPaid < expectedAmountPerInstallment) {
            balanceAmount = expectedAmountPerInstallment - previousAmountPaid;  // Pending balance
            nextInstallmentMonth = lastPayment ? lastPayment.installmentMonth : date;  // Keep the same month or use current month if no last payment
          } else {
            nextInstallmentMonth = this.incrementInstallmentMonth(lastPayment ? lastPayment.installmentMonth : date);  // Increment to the next month if previous amount is paid
          }
  
          const subscriberDetails = this.subDetail.subscriberDetails;
  
          this.receiptNo = this.formatSerialNumber(this.receiptNo);
          this.receiptNo = `${subscriberDetails.passbookNo}-${this.receiptNo}`;
  
          let receiptNumber2 = '';
          let secondInstallmentMonth = '';
          let excessAmount = 0;
  
          // Handle excess amount if the current amount exceeds the expected installment + balance
          const currentAmount = this.paymentForm.get('amount')?.value;
          if (currentAmount > expectedAmountPerInstallment + balanceAmount) {
            excessAmount = currentAmount - (expectedAmountPerInstallment + balanceAmount);
            secondInstallmentMonth = this.incrementInstallmentMonth(nextInstallmentMonth);
            nextInstallmentMonth = `${nextInstallmentMonth}, ${secondInstallmentMonth}`;
          }
  
          // Patch form with the updated installment month(s) and receipt number(s)
          this.paymentForm.patchValue({
            groupId: this.subDetail.chitGroupId,
            subscriberId: subscriberDetails.subscriberId,
            subscriberName: subscriberDetails.firstName,
            collectionType: subscriberDetails.collectionType,
            installmentMonth: nextInstallmentMonth,
            region: subscriberDetails.place,
            chitAmount: chitAmount,
            serialNumber: serialNumber,
            receiptNumber: this.receiptNo
          });
  
          if (receiptNumber2) {
            this.paymentForm.patchValue({
              receiptNumber: this.receiptNo,
              nextInstallmentMonth: secondInstallmentMonth
            });
          }
        });
      }
    }, error => {
      console.error('Error fetching payment details', error);
    });
  }
  
  handleAmountChange(amount: number, expectedInstallmentAmount: number,passbooknumber:any) {
    // Fetch the last payment or set default values if no previous payment exists
    const lastPayment = this.payments?.[this.payments.length - 1] || null;
    const previousAmountPaid = lastPayment ? lastPayment.amount || 0 : 0;
    
    let balanceAmount = 0;
    let currentInstallmentMonth = this.datePipe.transform(this.subDetail.auctionDate, 'dd-MMMM') || '';

    this.service.getAmountByMonth(passbooknumber,currentInstallmentMonth).subscribe((data)=>{
      console.log(data);
      
    })
  
    // If there's no previous payment, set balanceAmount to 0
    if (!lastPayment) {
      balanceAmount = 0;  // No balance to carry forward for the first payment
    } else if (previousAmountPaid < expectedInstallmentAmount) {
      // If there was a previous payment but it was less than expected, calculate the pending balance
      balanceAmount = expectedInstallmentAmount - previousAmountPaid;
      currentInstallmentMonth = lastPayment.installmentMonth;  // Keep the same month
    } else {
      // If the previous payment was equal to or more than expected, move to the next month
      currentInstallmentMonth = this.incrementInstallmentMonth(lastPayment.installmentMonth);
    }
  
    let installmentMonths = currentInstallmentMonth;  // Start with the current month
    let remainingAmount = amount;
    let appliedAmountForMonth = 0;
    let nextInstallmentMonth = '';
  
    // Apply the amount first to the balance for the current month
    if (remainingAmount > balanceAmount) {
      appliedAmountForMonth = balanceAmount;
      console.log(appliedAmountForMonth);
      
      remainingAmount -= balanceAmount;  // Subtract balance amount from the paid amount
      console.log(`Amount applied for ${currentInstallmentMonth}: ${appliedAmountForMonth}`);
    } else {
      // If the remaining amount is less than or equal to the balance
      appliedAmountForMonth = remainingAmount;
      remainingAmount = 0;  // No amount left to apply to future months
      console.log(`Amount applied for ${currentInstallmentMonth}: ${appliedAmountForMonth}`);
    }
  
    // Iterate and apply the remaining amount across multiple months
    while (remainingAmount > 0) {
      if (remainingAmount > expectedInstallmentAmount) {
        // Full installment for the next month
        remainingAmount -= expectedInstallmentAmount;
        appliedAmountForMonth = expectedInstallmentAmount;
  
        // Move to the next month
        nextInstallmentMonth = this.incrementInstallmentMonth(currentInstallmentMonth);
        installmentMonths += `, ${nextInstallmentMonth}`;
        console.log(`Amount applied for ${nextInstallmentMonth}: ${appliedAmountForMonth}`);
  
        currentInstallmentMonth = nextInstallmentMonth;  // Update current month to next month
      } else {
        // Apply partial amount to the next month if remainingAmount < expectedInstallmentAmount
        appliedAmountForMonth = remainingAmount;
        console.log(`Partial amount applied for ${currentInstallmentMonth}: ${appliedAmountForMonth}`);
  
        remainingAmount = 0;  // No amount left to apply
      }
    }
  
    // Patch the form with the final installment months
    this.paymentForm.patchValue({
      installmentMonth: installmentMonths,  // Patch all the months in which payments were applied
    });
  
    // Log for debugging
    console.log(`Installment Month(s): ${installmentMonths}`);
  }
  
  
  incrementInstallmentMonth(currentMonth: string): string {
    const dateParts = currentMonth.split('-');
    const day = dateParts[0]; // Keep the day
    const monthName = dateParts[1]; // Extract the month name
    const monthIndex = this.getMonthIndex(monthName); // Convert month name to index (0-11)
    
    // Create a new Date object and increment the month
    let nextMonthIndex = (monthIndex + 1) % 12; // Increment month, wrap to 0 after December
    let year = new Date().getFullYear(); // Use the current year

    if (monthIndex === 11) {
        // If it's December, move to January and increment the year
        year += 1;
    }

    const nextMonth = this.getMonthName(nextMonthIndex); // Convert back to month name

    // Return the new date with the same day and the incremented month and year if needed
    return `${day}-${nextMonth}-${year}`;
}
  
  // Helper to convert month name to index
  getMonthIndex(monthName: string): number {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(monthName);
  }
  
  // Helper to get month name from index
  getMonthName(monthIndex: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  }
  
  onSubmit(): void {
    const payload = this.paymentForm.value
    this.service.savePaymentDetails(payload).subscribe((response:any) => {
      this.receiptData = response.newPayment;
      const date = new Date( response.newPayment.date);

      this.month=date.toLocaleString('default', { month: 'long' }); 
      this.year=date.getFullYear();
  
    this.paymentForm.reset()
  
    
      console.log(response);
    });
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