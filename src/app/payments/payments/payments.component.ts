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
import { concatMap } from 'rxjs/operators';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  providers: [DatePipe]
})
export class PaymentsComponent implements OnInit {
  receiptNo: any
  staffs: any
  routeData: any
  routes: any[] = []
  staffData: any[] = []
  receiptData: any = {};
  paymentForm: FormGroup
  paymentData: any = {};
  subDetail: any
  data: any[] = [];
  paymentDetail: any
  totalPayment: any
  month: string
  year: number
  today: string = '';
  accessPrivData: any;
  subscriberDetail: any
  serialNumberCounter: number;
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView: boolean = false
  amount: any
  payments: any
  balance: boolean = false
  balanceMonth: string
  balanceAmount: number
  months: string
  isLoading: boolean = false;
  chitAmount: any
  passbookNo: string
  chitValue: any
  lastMonth: String
  lastAmount: any
  amountPayments: any
  lastPayment:boolean=false
  submitted:boolean=false
  passbookInstallmentData: any = {};
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: PaymentService,
    private staffService: StaffService,
    private chitService: ChitService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private routeService: AreaService) {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
  }
  installAmount: number
  installMonth: string
  ngOnInit(): void {

    this.paymentForm = this.formBuilder.group({
      date: ['', [Validators.required, this.validateCurrentDate]],
      serialNumber: ['', [Validators.required]],
      receiptNumber: ['', [Validators.required]],
      passbooknumber: ['PB-', [Validators.required]],
      groupId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      collectionType: ['', [Validators.required]],
      subscriberId: ['', [Validators.required]],
      subscriberName: ['', [Validators.required]],
      // installmentNumber:  ['',[Validators.required]],
      installmentMonth: ['', [Validators.required]],
      region: ['', [Validators.required]],
      selectStaff: ['', [Validators.required]],
      chitAmount: ['', [Validators.required]],
      cancelled: [''],
      verified: [''],
      deleteReason: [""],
      approvedBy: [""]
    },
      {
        validator: this.amountLessThanOrEqualChitAmount.bind(this)
      }
    );

    const today = new Date();
    this.today = today.toISOString().split('T')[0];
    this.paymentForm.get('cancelled')?.setValue(false)
    this.paymentForm.get('verified')?.setValue(false)

    this.paymentForm.get('passbooknumber').valueChanges.subscribe(passbooknumber => {
      if (passbooknumber) {
        this.getSubByPassbookNo(passbooknumber);
        this.passbookNo = passbooknumber
      }

    });

    this.paymentForm.get('amount')?.valueChanges.subscribe((amount) => {
      console.log(this.passbookNo);

      // this.getSubByPassbookNo(this.passbookNo);

      //     const expectedAmountPerInstallment = this.paymentForm.get('chitAmount')?.value;

      const groupId = this.paymentForm.get('groupId')?.value;
      const installmentMonth = this.paymentForm.get('installmentMonth')?.value;
      this.chitService.getTicketId(groupId).subscribe((data) => {

        if (data.auctionCycle > 1) {

          const installMent = this.datePipe.transform(data?.allData[data?.allData.length - 1].date, 'dd-MMMM-yyyy')
          const installmentDate = new Date(installmentMonth);
          const lastInstallmentDate = new Date(installMent);

          const auctionCycle = data.auctionCycle
          if (auctionCycle >= 20 && installmentDate.getTime() == lastInstallmentDate.getTime()) {
            this.lastPayment = true
            this.service.getTransactionById(groupId).subscribe((response) => {
              this.chitAmount = response
              this.chitAmount = this.chitAmount.payment
              this.chitAmount.forEach(Amount => {
                const chitAmount = this.paymentForm.get('chitAmount')?.value - Amount.walletBalance
                this.chitValue = chitAmount
                if (chitAmount && amount > 0) {
                  const expectedInstallmentAmount = chitAmount / 20;  // Monthly installment calculation
                  this.amount = amount

                  const amountControl = this.paymentForm.get('amount');

                  if (this.paymentForm.get('amount')?.value > expectedInstallmentAmount) {
                    // Set a custom error on the form control

                    this.paymentForm.get('amount')?.setErrors({ amountExceeds: true });

                  }
                  else {
                    // Clear any existing errors if the condition is satisfied
                    amountControl?.setErrors(null);
                  }

                  this.handleAmountChange(amount, expectedInstallmentAmount, this.passbookNo);
                }
              });
            })
          }
          else if (installmentDate.getTime() < lastInstallmentDate.getTime()) {
            const chitAmount = this.paymentForm.get('chitAmount')?.value;
            this.chitValue = chitAmount
            console.log("lesser");

            if (chitAmount && amount > 0) {
              const expectedInstallmentAmount = chitAmount / 20;  // Monthly installment calculation

              this.amount = amount
              this.handleAmountChange(amount, expectedInstallmentAmount, this.passbookNo);
            }
          }
          else if (installmentDate.getTime() > lastInstallmentDate.getTime()) {
            console.log("greater");

            // this.chitValue=0
            window.alert("Paid all Months")
            setTimeout(() => {
              this.isLoading = false
              // window.location.reload();
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/payment']);
              });
            }, 1000);
            // this.handleAmountChange(amount, 1, passbooknumber);
          }

        } else {
          const chitAmount = this.paymentForm.get('chitAmount')?.value;

          if (chitAmount && amount > 0) {
            const expectedInstallmentAmount = chitAmount / 20;  // Monthly installment calculation
            this.amount = amount
            this.handleAmountChange(amount, expectedInstallmentAmount, this.passbookNo);
          }
        }
      })
      if (!amount || amount.trim() === '') { // Check if amount is null, undefined, or an empty string
        this.receiptNo=""
        this.amount = 0
        this.balance = false
        this.balanceMonth = ""
        this.balanceAmount = 0
        // this.receiptNo=""
        this.paymentForm.patchValue({
          receiptNumber:"",
          installmentMonth:"", 
        });
        this.getSubByPassbookNo(this.passbookNo);
      }
    });

    this.service.getTodayPayment().subscribe((data) => {
      this.totalPayment = data
      this.serialNumberCounter = this.totalPayment.serialNo + 1
    })
    this.staffs = localStorage.getItem('name')
    this.staffs = this.staffs.replace(/"/g, '');
    this.routeService.getrouteAll().subscribe((data) => {
      this.routeData = data;
      this.routes = this.routeData.AllRoute.map((routeDetails, index) => ({
        routeId: routeDetails?.routeId,
      }))
    })
  }

  amountLessThanOrEqualChitAmount(form: AbstractControl) {
    const amount = +form.get('amount')?.value;
    const chitAmount = +form.get('chitAmount')?.value;

    if (amount && chitAmount) {
      if (amount <= 0) {
        return { invalidAmount: true }; // Validation error for zero or negative amount
      }
      if (amount > chitAmount) {
        return { amountExceedsChitAmount: true }; // Validation error if amount > chitAmount
      }
    }
    return null; // Valid
  }

  onContactChange(event: any) {
    let inputValue = event.target.value;

    // Remove non-numeric characters
    let numbersOnly = inputValue.replace(/[^\d]/g, '');

    // Ensure the value is greater than 0
    if (+numbersOnly <= 0) {
      numbersOnly = ''; // Clear the value if it is zero or less
    }

    // Retrieve chitAmount from the form
    const chitAmount = +this.paymentForm.get('chitAmount')?.value || 0;

    // Restrict the amount to chitAmount if it exceeds
    if (+numbersOnly > chitAmount) {
      numbersOnly = chitAmount.toString();
    }

    // Patch the valid value to the form
    this.paymentForm.patchValue({
      amount: numbersOnly
    });
  }


  onInputChange(event: any) {
    let inputValue = event.target.value;
    if (!inputValue.startsWith('PB-')) {
      this.paymentForm.patchValue({
        passbooknumber: 'PB-'
      });
    }
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
        let chitAmount = this.subDetail.chitAmount;

        // if(this.chitAmount){
        //    chitAmount = this.chitAmount;
        // }else{
        //   chitAmount = this.subDetail.chitAmount;
        // }
        
        console.log(this.chitValue);

        const expectedAmountPerInstallment = chitAmount / 20; // Monthly installment calculation
        const date = this.datePipe.transform(this.subDetail.auctionDate, 'dd-MMMM-YYYY') || '';

        this.service.getPaymentByPassbook(passbooknumber).subscribe(paymentData => {
          // Filter payments where cancelled is false
          this.paymentData = paymentData;
          this.payments = (this.paymentData?.payments || []).filter(payment => !payment.cancelled);

          // Check if there is a previous non-cancelled payment, else set previousAmountPaid to 0
          const lastPayment = this.payments.length > 0 ? this.payments[this.payments.length - 1] : null;
          const previousAmountPaid = lastPayment ? lastPayment.amount || 0 : 0;

          // Set receipt number and serial number
          console.log(paymentData);

          this.receiptNo = paymentData // Increment receipt number
          console.log(this.receiptNo);

          this.receiptNo = this.receiptNo ? this.receiptNo.receiptNo + 1 : 1; // Increment receipt number
          let serialNumber = this.formatSerialNumber(this.serialNumberCounter);
          let balanceAmount = 0;
          let nextInstallmentMonth = date;

          // Fetch total amount for the current installment month and handle underpayments
          this.service.getAmountByMonth(passbooknumber, lastPayment?.installmentMonth).subscribe((data) => {
            const totalAmountPaidForMonth = data.totalAmount || 0;

            // If the total amount for the previous month is less than the expected installment
            if (totalAmountPaidForMonth < expectedAmountPerInstallment) {
              balanceAmount = expectedAmountPerInstallment - totalAmountPaidForMonth; // Calculate pending balance
              nextInstallmentMonth = lastPayment ? lastPayment.installmentMonth : date; // Keep the same month for pending payments
            } else {
              nextInstallmentMonth = this.incrementInstallmentMonth(lastPayment ? lastPayment.installmentMonth : date); // Move to next month
            }

            const subscriberDetails = this.subDetail.subscriberDetails;

            this.receiptNo = this.formatSerialNumber(this.receiptNo);
            this.receiptNo = `${subscriberDetails.passbookNo}-${this.receiptNo}`;

            let receiptNumber2 = '';
            let secondInstallmentMonth = '';
            let excessAmount = 0;

            // Handle excess amount if the current payment exceeds the expected installment + balance
            const currentAmount = this.paymentForm.get('amount')?.value;
            if (currentAmount > expectedAmountPerInstallment + balanceAmount) {
              excessAmount = currentAmount - (expectedAmountPerInstallment + balanceAmount);
              secondInstallmentMonth = this.incrementInstallmentMonth(nextInstallmentMonth);
              nextInstallmentMonth = `${nextInstallmentMonth}, ${secondInstallmentMonth}`;
            }
            this.paymentForm.patchValue({
              groupId: this.subDetail.chitGroupId,
              subscriberId: subscriberDetails.subscriberId,
              subscriberName: subscriberDetails.firstName,
              collectionType: subscriberDetails.collectionType,
              installmentMonth: nextInstallmentMonth,
              region: subscriberDetails.place,
              chitAmount:  this.subDetail.chitAmount,
              serialNumber: serialNumber,
              receiptNumber: this.receiptNo
            });
            const groupId = this.paymentForm.get('groupId')?.value;
            const installmentMonth = this.paymentForm.get('installmentMonth')?.value;
            this.chitService.getTicketId(groupId).subscribe((data) => {
              console.log(data.allData);

              if (data.auctionCycle> 1) {
                console.log(data.allData[data.allData.length - 1].date);

                const installMent = this.datePipe.transform(data?.allData[data?.allData.length - 1].date, 'dd-MMMM-yyyy')
                const installmentDate = new Date(installmentMonth);
                const lastInstallmentDate = new Date(installMent);

                const auctionCycle = data.auctionCycle


                if (auctionCycle == 19) {
                  this.lastMonth = this.incrementInstallmentMonth(installMent)
                  this.service.getTransactionById(groupId).subscribe((response) => {
                    this.lastAmount = response
                    this.lastAmount = this.lastAmount.payment
                    this.lastAmount.forEach(Amount => {
                      const chitAmount = (this.paymentForm.get('chitAmount')?.value - Amount.walletBalance) / 20
                      console.log(chitAmount);
                      this.lastAmount = chitAmount
                    });
                  })
                }
                else if (auctionCycle >= 20) {
                  this.lastMonth = installMent
                  this.service.getTransactionById(groupId).subscribe((response) => {
                    this.lastAmount = response
                    this.lastAmount = this.lastAmount.payment
                    this.lastAmount.forEach(Amount => {

                      const chitAmount = (this.paymentForm.get('chitAmount')?.value - Amount.walletBalance) / 20
                      console.log(chitAmount);
                      this.lastAmount = chitAmount
                    });
                  })
                }
              }
            })
            if (receiptNumber2) {
              this.paymentForm.patchValue({
                // receiptNumber: this.receiptNo,
                nextInstallmentMonth: secondInstallmentMonth
              });
            }
          });
        });
      }
    }, error => {
      console.error('Error fetching payment details', error);
    });
  }


  handleAmountChange(amount: number, expectedInstallmentAmount: number, passbooknumber: any) {

    // Fetch the last payment or set default values if no previous payment exists
    const lastPayment = this.payments?.[this.payments.length - 1] || null;
    const previousAmountPaid = lastPayment ? lastPayment.amount || 0 : 0;
    const chitAmount = this.chitValue;

    const expectedAmountPerInstallment = chitAmount / 20; // Monthly installment calculation

    let balanceAmount = 0;
    let currentInstallmentMonth = this.datePipe.transform(this.subDetail.auctionDate, 'dd-MMMM-YYYY') || '';

    // Fetch total amount for the last payment's month to check underpayment
    this.service.getAmountByMonth(passbooknumber, lastPayment?.installmentMonth).subscribe((data) => {
      const totalAmountPaidForMonth = data.totalAmount || 0;

      // If there's no previous payment, set balanceAmount to 0
      if (!lastPayment) {
        balanceAmount = 0;  // No balance to carry forward for the first payment
      } 
      else if (totalAmountPaidForMonth < expectedInstallmentAmount) {
        // If there was a previous underpayment, calculate the pending balance
        balanceAmount = expectedInstallmentAmount - totalAmountPaidForMonth;
        currentInstallmentMonth = lastPayment.installmentMonth;  // Keep the same month
        let balanceAm = amount - balanceAmount

        if (balanceAm > 0 && !this.lastPayment) {
          this.amount = balanceAm
          this.balance = true
          this.balanceMonth = currentInstallmentMonth
          this.balanceAmount = balanceAmount
         
          const next = this.incrementInstallmentMonth(this.balanceMonth);
 
          currentInstallmentMonth =this.incrementInstallmentMonth(lastPayment.installmentMonth);;
          this.months = this.incrementInstallmentMonth(currentInstallmentMonth);

        }
      }
      
    //   else if (totalAmountPaidForMonth < expectedInstallmentAmount) {
    //     console.log(lastPayment.installmentMonth);

    //     // If there was a previous underpayment, calculate the pending balance
    //     balanceAmount = expectedInstallmentAmount - totalAmountPaidForMonth;
    //     let balanceAm = amount - balanceAmount;
    
    //     if (balanceAm > 0 && !this.lastPayment) {
    //         this.amount = balanceAm;
    //         this.balance = true;
    //         this.balanceAmount = balanceAmount;
    
    //         // Increment to the next month instead of keeping the same month
    //         this.balanceMonth =lastPayment.installmentMonth
    //         currentInstallmentMonth =this.incrementInstallmentMonth(lastPayment.installmentMonth);;
    
    //         // Increment further if necessary for subsequent months
    //         this.months = this.incrementInstallmentMonth(currentInstallmentMonth);
    //     }
    // }
    
    
       else {
        // If the previous payment was enough, move to the next month
        currentInstallmentMonth = this.incrementInstallmentMonth(lastPayment.installmentMonth);
        this.months = currentInstallmentMonth

      }
      console.log(this.months);
      let installmentMonths = currentInstallmentMonth;  // Start with the current month
      let remainingAmount = amount;
      let appliedAmountForMonth = 0;
      let nextInstallmentMonth = '';
      
      // Apply the amount first to the balance for the current month
      if (remainingAmount > balanceAmount && !this.lastPayment) {
        appliedAmountForMonth = balanceAmount;

        remainingAmount -= balanceAmount;  // Subtract balance amount from the paid amount

      } else {
        // If the remaining amount is less than or equal to the balance

        appliedAmountForMonth = remainingAmount;
        remainingAmount = 0;  // No amount left to apply to future months
      }
      
      // Iterate and apply the remaining amount across multiple months
      while (remainingAmount > 0 && !this.lastPayment) {

        if (remainingAmount > expectedInstallmentAmount) {

          remainingAmount -= expectedInstallmentAmount;
          appliedAmountForMonth = expectedInstallmentAmount;
          nextInstallmentMonth = this.incrementInstallmentMonth(currentInstallmentMonth);
          installmentMonths += `, ${nextInstallmentMonth}`;

          currentInstallmentMonth = nextInstallmentMonth;  // Update current month to next month
        } else {
          appliedAmountForMonth = remainingAmount;
          remainingAmount = 0;  // No amount left to apply
        }
      }
      if (!this.balance&& !this.lastPayment) {
        this.months = installmentMonths
      }
      console.log(this.months);
      this.paymentForm.patchValue({
        installmentMonth: installmentMonths,  // Patch all the months in which payments were applied
      });
    });

   
  }

  incrementInstallmentMonth(currentMonth: string): string {
    const dateParts = currentMonth.split('-');
    const day = dateParts[0]; // Keep the day
    const monthName = dateParts[1]; // Extract the month name
    const monthIndex = this.getMonthIndex(monthName); // Convert month name to index (0-11)

    // Create a new Date object and increment the month
    let nextMonthIndex = (monthIndex + 1) % 12; // Increment month, wrap to 0 after December

    let year = parseInt(dateParts[2]);
    if (monthIndex === 11) {
      // If it's December, move to January and increment the year
      year += 1;
    }

    const nextMonth = this.getMonthName(nextMonthIndex); // Convert back to month name

    // Return the new date with the same day and the incremented month and year if needed
    return `${day}-${nextMonth}-${year}`;
  }

  installmentMonth(currentMonth: string): string {
    const dateParts = currentMonth.split('-');
    const day = dateParts[0]; // Keep the day
    const monthName = dateParts[1]; // Extract the month name
    const monthIndex = this.getMonthIndex(monthName); // Convert month name to index (0-11)

    // Create a new Date object and increment the month
    let nextMonthIndex = (monthIndex + 1) % 12; // Increment month, wrap to 0 after December

    let year = parseInt(dateParts[2]);
    if (monthIndex === 11) {
      // If it's December, move to January and increment the year
      year += 1;
    }

    const nextMonth = this.getMonthName(nextMonthIndex); // Convert back to month name

    // Return the new date with the same day and the incremented month and year if needed
    return `${currentMonth} , ${day}-${nextMonth}-${year}`;
  }
  
  incrementInstallment(currentMonth: string): string {
    const dateParts = currentMonth.split('-');
    const day = dateParts[0]; // Keep the day
    const monthName = dateParts[1]; // Extract the month name
    const monthIndex = this.getMonthIndex(monthName); // Convert month name to index (0-11)

    // Create a new Date object and increment the month
    let nextMonthIndex = (monthIndex + 1) % 12; // Increment month, wrap to 0 after December

    let year = parseInt(dateParts[2]);
    if (monthIndex === 11) {
      // If it's December, move to January and increment the year
      year += 1;
    }

    const nextMonth = this.getMonthName(nextMonthIndex); // Convert back to month name

    // Return the new date with the same day and the incremented month and year if needed
    return `${currentMonth} , ${day}-${nextMonth}-${year}`;
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

  preview() {
    const payload = this.paymentForm.value;
    this.installMonth = this.paymentForm.get('installmentMonth')?.value
    this.installAmount = this.paymentForm.get('amount')?.value
    const installmentMonths = payload.installmentMonth.split(',').map(month => month.trim()); // Split by comma and trim spaces

    const chitAmount = this.chitValue;
    console.log(chitAmount);

    const baseAmount = Math.floor(chitAmount / 20); // Base amount for each month
    let months = installmentMonths.length
    const remainingAmount = this.installAmount - (baseAmount * (months - 1))
    installmentMonths.forEach((month, index) => {
      // Create a copy of the payload for each month
      const monthPayload = { ...payload, installmentMonth: month };

      // Set the amount for each month
      if (index < months - 1) {
        monthPayload.amount = baseAmount; // Set amount for the first 4 months
      } else {
        monthPayload.amount = remainingAmount; // Set remaining amount for the last month
      }
      this.receiptData = payload;
      const date = new Date(payload.date);

      this.month = date.toLocaleString('default', { month: 'long' });
      this.year = date.getFullYear();


    });
  }


//   onSubmit(): void {
   
//     this.submitted=true
//     if (this.balance) {
//       const payload = this.paymentForm.value;
//       this.installMonth = this.paymentForm.get('installmentMonth')?.value;
//       this.installAmount = this.amount;
    
//       console.log(this.installAmount, this.installMonth);
    
//       const installmentMonths = this.installMonth.split(',').map((month) => month.trim()); // Split by comma and trim spaces
//       const chitAmount = this.chitValue;
//       console.log(installmentMonths);
    
//       const baseAmount = Math.floor(chitAmount / 20); // Base amount for each month
//       let months = installmentMonths.length;
//       const remainingAmount = this.installAmount - baseAmount * (months - 1);
    
//       // Adjust the months by inserting the balance month at the 0th index
//       const adjustedMonths = [this.balanceMonth, ...installmentMonths];
    
//       // Sort the months in chronological order
//       const sortedMonths = adjustedMonths.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
//       console.log(sortedMonths);
    
//       sortedMonths.forEach((month, index) => {
//         // Create a copy of the payload for each month
//         const monthPayload = { ...payload, installmentMonth: month };
//         console.log(monthPayload);
        
//         // Set the amount for each month
//         if (index === 0) {
//           monthPayload.amount = this.balanceAmount; // Set the balance amount for the balance month
//         } else if (index < sortedMonths.length - 1) {
//           monthPayload.amount = baseAmount; // Set base amount for the middle months
//         } else {
//           monthPayload.amount = remainingAmount; // Set remaining amount for the last month
//         }
    
//         // Save payment details for each month
//         this.service.savePaymentDetails(monthPayload).subscribe((response: any) => {
//           this.receiptData = response.newPayment;
          
//           const date = new Date(response.newPayment.date);
    
//           this.month = date.toLocaleString('default', { month: 'long' });
//           this.year = date.getFullYear();
//           this.months = '';
//           this.amount = 0;
//           this.balanceAmount = 0;
//           this.balance = false;
    
//           const currentDate = this.paymentForm.get('date')?.value;
//           this.paymentForm.reset({
//             date: currentDate, // Keep the 'date' field intact
//           });
//           this.paymentForm.get('cancelled')?.setValue(false);
//           this.paymentForm.get('verified')?.setValue(false);
//           this.paymentForm.patchValue({
//             passbooknumber: 'PB-',
//           });
//         });
//       });
//     }
    
    
//     else {
//       const payload = this.paymentForm.value;
//       this.installMonth = this.paymentForm.get('installmentMonth')?.value
//       this.installAmount = this.paymentForm.get('amount')?.value
//       const installmentMonths = payload.installmentMonth.split(',').map(month => month.trim()); // Split by comma and trim spaces

//       const chitAmount = this.chitValue;
//       const baseAmount = Math.floor(chitAmount / 20); // Base amount for each month
//       let months = installmentMonths.length
//       const remainingAmount = this.installAmount - (baseAmount * (months - 1))

//       installmentMonths.forEach((month, index) => {
//         // Create a copy of the payload for each month
//         const monthPayload = { ...payload, installmentMonth: month };

//         // Set the amount for each month
//         if (index < months - 1) {
//           monthPayload.amount = baseAmount; // Set amount for the first 4 months
//         } else {
//           monthPayload.amount = remainingAmount; // Set remaining amount for the last month
//         }

//         // Save payment details for each month
//         this.service.savePaymentDetails(monthPayload).subscribe((response: any) => {
//           this.receiptData = response.newPayment;
//           const date = new Date(response.newPayment.date);

//           this.month = date.toLocaleString('default', { month: 'long' });
//           this.year = date.getFullYear();

//           // setTimeout(() => {
//           //   this.downloadAsPDF()
//           // }, 1 * 1000);
//           // 3 minutes = 180,000 milliseconds
//           this.months = ""

//           this.balance = false
//           this.amount = 0
//           const currentDate = this.paymentForm.get('date')?.value;
//           this.paymentForm.reset({
//             date: currentDate  // Keep the 'date' field intact
//           });
//           this.paymentForm.get('cancelled')?.setValue(false)
//           this.paymentForm.get('verified')?.setValue(false)
//           this.balance = false
//           this.balanceAmount = 0

//           this.paymentForm.patchValue({
//             passbooknumber: 'PB-',
//           });
//         });
//       });
//     }
//     this.isLoading = true;
// // Replace with actual API call logic

//   }

async onSubmit(): Promise<void> {
  this.submitted = true;

  const processMonths = async (months: string[], baseAmount: number, remainingAmount: number, payload: any) => {
    for (let index = 0; index < months.length; index++) {
      const month = months[index];
      const monthPayload = { ...payload, installmentMonth: month };

      // Set the amount for each month
      if (index === 0 && this.balance) {
        monthPayload.amount = this.balanceAmount; // Set balance amount for the balance month
      } else if (index < months.length - 1) {
        monthPayload.amount = baseAmount; // Set base amount for middle months
      } else {
        monthPayload.amount = remainingAmount; // Set remaining amount for the last month
      }

      await this.savePaymentDetails(monthPayload);
    }
  };

  if (this.balance) {
    const payload = this.paymentForm.value;
    this.installMonth = this.paymentForm.get('installmentMonth')?.value;
    this.installAmount = this.amount;

    const installmentMonths = this.installMonth.split(',').map((month) => month.trim()); // Split by comma and trim spaces
    const chitAmount = this.chitValue;
    const baseAmount = Math.floor(chitAmount / 20); // Base amount for each month
    const remainingAmount = this.installAmount - baseAmount * (installmentMonths.length - 1);

    // Adjust the months by inserting the balance month at the 0th index
    const adjustedMonths = [this.balanceMonth, ...installmentMonths];
    const sortedMonths = adjustedMonths.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    await processMonths(sortedMonths, baseAmount, remainingAmount, payload);
  } else {
    const payload = this.paymentForm.value;
    this.installMonth = this.paymentForm.get('installmentMonth')?.value;
    this.installAmount = this.paymentForm.get('amount')?.value;

    const installmentMonths = payload.installmentMonth.split(',').map((month) => month.trim()); // Split by comma and trim spaces
    const chitAmount = this.chitValue;
    const baseAmount = Math.floor(chitAmount / 20); // Base amount for each month
    const remainingAmount = this.installAmount - baseAmount * (installmentMonths.length - 1);

    await processMonths(installmentMonths, baseAmount, remainingAmount, payload);
  }

  this.isLoading = true;
}

private async savePaymentDetails(monthPayload: any): Promise<void> {
  return new Promise((resolve, reject) => {
    this.service.savePaymentDetails(monthPayload).subscribe({
      next: (response: any) => {
        this.receiptData = response.newPayment;

        const date = new Date(response.newPayment.date);
        this.month = date.toLocaleString('default', { month: 'long' });
        this.year = date.getFullYear();
        this.months = '';
        this.amount = 0;
        this.balanceAmount = 0;
        this.balance = false;

        const currentDate = this.paymentForm.get('date')?.value;
        this.paymentForm.reset({
          date: currentDate, // Keep the 'date' field intact
        });
        this.paymentForm.get('cancelled')?.setValue(false);
        this.paymentForm.get('verified')?.setValue(false);
        this.paymentForm.patchValue({
          passbooknumber: 'PB-',
        });

        resolve();
      },
      error: (err) => reject(err),
    });
  });
}

  close(){
    setTimeout(() => {
      this.isLoading = false
      // window.location.reload();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/payment']);
      });
    }, 1000); 
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

      pdf.save(`${this.receiptNo}.pdf`);
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