import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StaffService } from '../../staff/shared/service/staff.service';
import { AreaService } from '../../area/shared/service/area.service';
import { PaymentService } from '../shared/service/payment.service';
import { ITableColumn } from '../../shared/interface/list-table';
import { CellClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {
  Staffs: string[];
  Areas: string[];
  staffs: any
  data: any[] = [];
  routeData:any
  routes:any[]=[]
  routeId:any
  totalAmount:any
  collectedAmount:any
  selectedStaff:any
  collectionForm:FormGroup
  date:Date
  paymentData: any = {};  
  avlData: any[] = [];
  canData: any[] = [];
  searchImg:string='assets/table/black search.svg'
  filterImg:string='assets/table/black filter.svg'
  search:boolean=true
  showCancelledPayments = false;
  paymentBody:any
  passbooknumber:any
  constructor(private formBuilder:FormBuilder,
    private staffService:StaffService,
    private routeService:AreaService,
    private service:PaymentService,
  ){}
  ngOnInit(): void {
    this.collectionForm = this.formBuilder.group({
      date: ['', [Validators.required,this.validatePastOrTodayDate]],
      routeId:  ['', [Validators.required]],
      selectedStaff:  ['', [Validators.required]],
      collectionAmount:  ['', [Validators.required]],
      amountCollected:  ['', [Validators.required,]],
      balance:  ['', [Validators.required,this.balanceValidator()]],
      serialNumberCount:  ['', [Validators.required]],
      verifiedBy:  ['', [Validators.required]],
      passbookno: this.formBuilder.array([]),
      verified:[false]
      });

      // this.staffService.getstaffAll().subscribe((data)=>{
      //   this.staffs=data  
      //  this.data=this.staffs.AllStaff.map((staffDetails,index)=>({
      //   staffName:staffDetails.firstName
      //  }))
      //  })
      this.staffs=localStorage.getItem('name')
      this.staffs=this.staffs.replace(/"/g, ''); 
      console.log(this.staffs);
      

       this.collectionForm.get('date')?.valueChanges.subscribe(date => {
        this.date = date;
        
        // Reset dependent form controls when the date changes
        this.collectionForm.controls['routeId'].reset();
        this.collectionForm.controls['selectedStaff'].reset();
      
        // Fetch routes by date
        this.service.getRouteByDate(this.date).subscribe(data => {
          this.routeData = data;
          
          // Map the route data to the routes array
          this.routes = this.routeData.region.map((routeDetails, index) => ({
            routeId: routeDetails,
          }));
      
          // Listen for changes in 'routeId' field
          this.collectionForm.get('routeId')?.valueChanges.subscribe(routeId => {
            this.routeId = routeId;
            
            // Fetch staff based on selected date and routeId
            this.service.getStaff(this.date, this.routeId).subscribe(data => {
              this.totalAmount = data;
              
              // Map the staff data to the selectedStaff array
              this.selectedStaff = this.totalAmount.selectStaff.map((details, index) => ({
                selectStaff: details
              }));
      
              // Listen for changes in 'selectedStaff' field
              this.collectionForm.get('selectedStaff')?.valueChanges.subscribe(selectStaff => {
                
                // Fetch total amount based on date, routeId, and selectedStaff
                this.service.getTotal(this.date, this.routeId, selectStaff).subscribe(amount => {
                  this.collectedAmount = amount;
                  
                  this.getAllPayment(this.date, this.routeId, selectStaff)
                  // Update form values with collected amount and serial number count
                  this.collectionForm.patchValue({
                    collectionAmount: this.collectedAmount.totalAmount,
                    serialNumberCount: this.collectedAmount.length,
                  });
                });
      
                // Fetch passbook numbers based on date, routeId, and selectedStaff
                this.service.getPassbookNo(this.date, this.routeId, selectStaff).subscribe(passbookno => {
                  this.passbooknumber = passbookno;
                  this.passbooknumber=this.passbooknumber.passbooknumber
                  const passbookArray = this.collectionForm.get('passbookno') as FormArray;
                  passbookArray.clear();
      
                  // Populate the passbookno array in the form
                  this.passbooknumber.forEach((pb: string) => {
                    passbookArray.push(this.formBuilder.control(pb));
                  });
      
                  // Set verified to true once passbook numbers are loaded
                  this.collectionForm.get('verified').setValue(true);
                });
              });
            });
          });
        });
      
        // Listen for changes in 'amountCollected' field
        this.collectionForm.get('amountCollected')?.valueChanges.subscribe(amountCollected => {
          // Update the balance based on collectedAmount and amountCollected
          this.collectionForm.patchValue({
            balance: this.collectedAmount.totalAmount - amountCollected,
          });
        });
      });
      

  }

  validatePastOrTodayDate(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    return selectedDate <= today ? null : { invalidDate: true };
  }
  
  balanceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Ensure the value is a number and check if it's greater or less than 0
      if (value > 0 || value < 0) {
        return { invalidBalance: true }; // Return an error if balance is not 0
      }

      return null; // Return null if balance is exactly 0 (valid)
    };
  }

  getAllPayment(date:Date,routeId:string,selectStaff:string) {
    this.service.getTotal(date,routeId,selectStaff).subscribe((data) => {
      this.paymentData = data;
       console.log(this.paymentData,"payment daat");
  
      // Initialize arrays for available and cancelled payments
      this.avlData = [];
      this.canData = [];
  
      // Counters for serial numbers
      let availableSno = 1;
      let cancelledSno = 1;
  
      if (this.paymentData.payments) {
        // Separate payments based on the cancelled status
        this.paymentData.payments.forEach((paymentDetail) => {
          const formattedPayment = {
            id: paymentDetail?._id,
            passbooknumber: paymentDetail?.passbooknumber,
            groupId: paymentDetail?.groupId,
            amount: paymentDetail?.amount,
            receiptNumber: paymentDetail?.receiptNumber,
            cancelled: paymentDetail?.cancelled,
            verified: true,
            chitAmount:paymentDetail?.chitAmount,
            region:paymentDetail?.region,
            subscriberId:paymentDetail?.subscriberId,
            subscriberName:paymentDetail?.subscribeName,
            installmentMonth:paymentDetail?.installmentMonth,
            selectStaff:paymentDetail?.selectStaff,
            serialNumber:paymentDetail?.serialNumber,
            date:paymentDetail?.date,
            collectionType:paymentDetail?.collectionType
          };
  
          // Push to appropriate array based on the cancelled status
          if (paymentDetail?.cancelled) {
            this.canData.push({
              ...formattedPayment,
              sno: cancelledSno++,
            });
            console.log(this.canData)

          } else if(!paymentDetail?.cancelled) {
            this.avlData.push({
              ...formattedPayment,
              sno: availableSno++,
            });
            console.log(this.avlData);

          }
        });
      }
    });
    

  }


  column: ITableColumn[] = [
    {
      label: 'Serial No',
      field: 'sno',
      filterList:false,
    },
    {
      label: 'Receipt Number',
      field: 'receiptNumber',
      filterList:false,
    },
    {
      label: 'Passbook Number',
      field: 'passbooknumber',
      filterList:true,
    },
    {
      label: 'Group Id',
      field: 'groupId',
      filterList:true,
    },
    
    {
      label: 'Amount Paid',
      field: 'amount',
      filterList:false,
      cellStyle: { color: '#12B76A' },
    },
  ];
  
  columnCancelled: ITableColumn[] = [
    {
      label: 'Serial No',
      field: 'sno',
      filterList:false,
    },
    {
      label: 'Receipt Number',
      field: 'receiptNumber',
      filterList:false,
    },
    {
      label: 'Passbook Number',
      field: 'passbooknumber',
      filterList:true,
    },
    {
      label: 'Group Id',
      field: 'groupId',
      filterList:true,
    },
    
    {
      label: 'Amount Paid',
      field: 'amount',
      filterList:false,
      cellStyle: { color: 'red' },
    },
  ];

  togglePayments() {
    this.showCancelledPayments = !this.showCancelledPayments;
  }
  
  onSubmit(){
     const payload=this.collectionForm.value
     const balance = this.collectionForm.get('balance')?.value;
     console.log(balance);
     
     this.avlData.forEach((payment) => {
      this.paymentBody = {
       date: payment.date,
       receiptNumber: payment.receiptNumber,
       passbooknumber: payment.passbooknumber,
       groupId: payment.groupId,
       amount: payment.amount,
       verified: true, // Ensure verified is set to true
       chitAmount: payment.chitAmount,
       region: payment.region,
       subscriberId: payment.subscriberId,
       subscriberName: payment.subscriberName,
       installmentMonth: payment.installmentMonth,
       selectStaff: payment.selectStaff,
       serialNumber: payment.serialNumber,
       collectionType: payment.collectionType,
     };
     console.log(this.paymentBody);
     
     this.service.savePaymentDetails(this.paymentBody, payment.id).subscribe(
       (response) => {
         console.log(`Payment with ID: ${payment.id} saved successfully.`, response);
       },
       (error) => {
         console.error(`Failed to save payment with ID: ${payment.id}`, error);
       }
     );
   });
     // Check if the balance is less than 0
    //  if (balance < 0) {
    //          this.collectionForm.disable();
       
    //    return; 
    //  }
     this.service.saveCollectionDetails(payload).subscribe((response:any)=>{
       console.log(response);
       this.collectionForm.reset()
     })
  }
}
