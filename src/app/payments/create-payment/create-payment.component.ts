import { AfterViewInit, Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { IPaymentForm } from '../shared/interface/payment-form';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { PaymentService } from '../shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
import { ServiceService } from '../../settings/shared/service.service';
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
  reasonData: any
  cancelled:any[]=[];
  paymentDetail:any
  accessPrivData: any;
  subscriberDetail:any
  searchImg:string='assets/table/black search.svg'
  filterImg:string='assets/table/black filter.svg'
  search:boolean=true
  modalErrorMessage: string = '';
  breadcrumsData:any = [
    {
      key: 'Payments',
      routerLink: '/payment',
    },
  ];
  activeTab: string = 'home'; 
  canCreate: boolean = false;
  reasonCancelForm:FormGroup;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView:boolean=false 
  showCancelledPayments = false;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService:AuthService,
    private settings: ServiceService,
    private service: PaymentService) { }

  ngOnInit(): void {
    this.reasonCancelForm=new FormGroup({deleteReason:new FormControl(null)})
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
this.settings.getAllReason().subscribe(
  (data)=>{
    this.reasonData=data
    this.reasonData=this.reasonData.res
    console.log(this.reasonData,"Delete Reason")

  }
)
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
            // deleteReason:paymentDetail?.deleteReason

          };
  
          // Push to appropriate array based on the cancelled status
          if (paymentDetail?.cancelled) {
            this.cancelled.push({
              ...formattedPayment,
              sno: cancelledSno++,
             deleteReason:paymentDetail?.deleteReason

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
    filterList:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Receipt Number',
    field: 'receiptNumber',
    filterList:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Passbook Number',
    field: 'passbooknumber',
    filterList:true,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Group Id',
    field: 'groupId',
    filterList:true,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  
  {
    label: 'Amount Paid',
    field: 'amount',
    filterList:false,
    cellStyle: { color: '#12B76A' },
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
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

  {
    label: 'Reason Cancellation',
    field: 'deleteReason',
    filterList:false,
    cellStyle: { color: 'red' },
  },
];



showModal(message: string): void {
  this.modalErrorMessage = message;
  const modal = document.getElementById('deleteTypeModal');
  modal.style.display = 'block';
}
deleteConfirm(id){
  if (confirm)
    {
      this.paymentDetail.cancelled=true
      this.paymentDetail.deleteReason=this.reasonCancelForm.get('deleteReason')?.value
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

delete(id) {
  if (confirm)
     {
    this.showModal("Do you want to delete?")
    // this.paymentDetail.cancelled=true
    // let cancelled=this.paymentDetail
    // console.log(cancelled);
    
    // this.service.savePaymentDetails( cancelled,id).subscribe(
    //   (response:any) => {
    //     console.log(response);
        
    //   },
    // );
  }
  // this.paymentDetail = null;
  // this.getAllPayment();
  // this.router.navigate(["/payment"]);
}

 cancel(){
  this.paymentDetail=null
 }  
 changeTab(tab: string) {
  this.activeTab = tab;
}


}

