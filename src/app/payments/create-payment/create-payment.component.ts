import { AfterViewInit, Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { IPaymentForm } from '../shared/interface/payment-form';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { PaymentService } from '../shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent{
  Staffs: string[];
  deletedPayments: any
  paymentForm: FormGroup<IPaymentForm>;
  paymentData: any = {};  

  data: any[] = [];
  cancelled:any[]=[];
  paymentDetail:any
  accessPrivData: any;
  subscriberDetail:any
  searchImg:string='assets/table/black search.svg'
  filterImg:string='assets/table/black filter.svg'
  search:boolean=true
  breadcrumsData:any = [
    {
      key: 'Payments',
      routerLink: '/payment',
    },
  ];
  activeTab: string = 'home'; 
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView:boolean=false 
  showCancelledPayments = false;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService:AuthService,
    private service: PaymentService) { }

  ngOnInit(): void {
    this.authService.checkAccess('Payments', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate=true
      }
    });

    this.authService.checkAccess('Payments', 'edit').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canEdit=true
      }
    });

    this.authService.checkAccess('Payments', 'view').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canView=true
      }
    });
    this.authService.checkAccess('Payments', 'delete').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canDelete=true
      }
    });
this.getAllPayment()
  }

  
  getAllPayment() {
    this.service.getTodayPayment().subscribe((data) => {
      this.paymentData = data;
      console.log(this.deletedPayments, "deleted");
  
      // Initialize arrays for available and cancelled payments
      this.data = [];
      this.cancelled = [];
  
      // Counters for serial numbers
      let availableSno = 1;
      let cancelledSno = 1;
  
      if (this.paymentData.AllPayment) {
        // Separate payments based on the cancelled status
        this.paymentData.AllPayment.forEach((paymentDetail) => {
          const formattedPayment = {
            id: paymentDetail?._id,
            passbooknumber: paymentDetail?.passbooknumber,
            groupId: paymentDetail?.groupId,  
            amount: paymentDetail?.amount,
            receiptNumber: paymentDetail?.receiptNumber,
            cancelled: paymentDetail?.cancelled,
          };
  
          // Push to appropriate array based on the cancelled status
          if (paymentDetail?.cancelled) {
            this.cancelled.push({
              ...formattedPayment,
              sno: cancelledSno++,
            });
          } else {
            this.data.push({
              ...formattedPayment,
              sno: availableSno++,
            });
          }
        });
      }
    });
  }
  
  togglePayments() {
  this.showCancelledPayments = !this.showCancelledPayments;
}
getPaymentById(id: string): void {
  this.service.getPaymentById(id).subscribe(
    data => {
      this.paymentDetail = data;
    },
    error => {
      console.error('Error fetching payment', error);
    }
  );
}
column: ITableColumn[] = [
  {
    label: 'Serial No',
    field: 'sno',
    filter:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Receipt Number',
    field: 'receiptNumber',
    filter:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Passbook Number',
    field: 'passbooknumber',
    filter:true,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Group Id',
    field: 'groupId',
    filter:true,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  
  {
    label: 'Amount Paid',
    field: 'amount',
    filter:false,
    cellStyle: { color: '#12B76A' },
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
];

columnCancelled: ITableColumn[] = [
  {
    label: 'Serial No',
    field: 'sno',
    filter:false,
  },
  {
    label: 'Receipt Number',
    field: 'receiptNumber',
    filter:false,
  },
  {
    label: 'Passbook Number',
    field: 'passbooknumber',
    filter:true,
  },
  {
    label: 'Group Id',
    field: 'groupId',
    filter:true,
  },
  
  {
    label: 'Amount Paid',
    field: 'amount',
    filter:false,
    cellStyle: { color: 'red' },
  },
];

delete(id) {
  if (confirm('Are you sure you want to delete this subscriber?')) {
 
    this.paymentDetail.cancelled=true
    let cancelled=this.paymentDetail
    console.log(cancelled);
    
    this.service.savePaymentDetails( cancelled,id).subscribe(
      (response:any) => {
        console.log(response);
        
      },
    );
  }
  this.paymentDetail = null;
  this.getAllPayment();
  this.router.navigate(["/payment"]);
}

 cancel(){
  this.paymentDetail=null
 }  
 changeTab(tab: string) {
  this.activeTab = tab;
}


}

