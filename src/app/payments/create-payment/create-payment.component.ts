import { AfterViewInit, Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { IPaymentForm } from '../shared/interface/payment-form';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { PaymentService } from '../shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
import { ServiceService } from '../../settings/shared/service.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent {
  Staffs: string[];
  deletedPayments: any
  paymentForm: FormGroup<IPaymentForm>;
  paymentData: any = {};
  data: any[] = [];
  reasonData: any
  cancelled: any[] = [];
  paymentDetail: any
  accessPrivData: any;
  subscriberDetail: any
  filter: boolean = true
  searchImg: string = 'assets/table/black search.svg'
  filterImg: string = 'assets/table/black filter.svg'
  search: boolean = true
  modalErrorMessage: string = '';
  popup: boolean = false
  breadcrumsData: any = [
    {
      key: 'Payments',
      routerLink: '/payment',
    },
  ];
  activeTab: string = 'home';
  canCreate: boolean = false;
  reasonCancelForm: FormGroup;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView: boolean = false
  showCancelledPayments = false;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private settings: ServiceService,
    private service: PaymentService) { }

  ngOnInit(): void {
    this.reasonCancelForm =this.formBuilder.group({
      deleteReason:["", [Validators.required]]
    })
    this.authService.checkAccess('Payments', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate = true
      }
    });

    this.authService.checkAccess('Payments', 'edit').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canEdit = true
      }
    });

    this.authService.checkAccess('Payments', 'view').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canView = true
      }
    });
    this.authService.checkAccess('Payments', 'delete').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canDelete = true
      }
    });

    this.service.getTodayPayment().subscribe((data) => {
      this.paymentData = data;
      this.data = [];
      this.cancelled = [];
      let availableSno = 1;
      let cancelledSno = 1;

      if (this.paymentData.AllPayment) {
        this.paymentData.AllPayment.forEach((paymentDetail) => {
          const formattedPayment = {
            id: paymentDetail?._id,
            passbooknumber: paymentDetail?.passbooknumber,
            groupId: paymentDetail?.groupId,
            amount: paymentDetail?.amount,
            receiptNumber: paymentDetail?.receiptNumber,
            subscriberName:paymentDetail?.subscriberName,
            installmentMonth:paymentDetail?.installmentMonth,
            cancelled: paymentDetail?.cancelled,
            serialNumber:paymentDetail?.serialNumber
          };

          // Push to appropriate array based on cancelled status
          if (paymentDetail?.cancelled && !paymentDetail?.verified) {
            this.cancelled.push({
              ...formattedPayment,
              sno: cancelledSno++,
              deleteReason: paymentDetail?.deleteReason,
            });
          } else if (!paymentDetail?.cancelled && !paymentDetail?.verified) {
            this.data.push({
              ...formattedPayment,
              sno: availableSno++,
            });
          }
        });
      }
    });
    // this.getAllPayment()
    this.settings.getAllReason().subscribe(
      (data) => {
        this.reasonData = data
        this.reasonData = this.reasonData.res
      }
    )
  }

  getAllPayment() {
    // Polling interval (every 10 seconds in this example)
    
      this.service.getTodayPayment().subscribe((data) => {
        this.paymentData = data;

        // Reset arrays for available and cancelled payments
        this.data = [];
        this.cancelled = [];

        // Counters for serial numbers
        let availableSno = 1;
        let cancelledSno = 1;
        
        if (this.paymentData.AllPayment) {
          this.paymentData.AllPayment.forEach((paymentDetail) => {
            const formattedPayment = {
              id: paymentDetail?._id,
              passbooknumber: paymentDetail?.passbooknumber,
              groupId: paymentDetail?.groupId,
              amount: paymentDetail?.amount,
              receiptNumber: paymentDetail?.receiptNumber,
              subscriberName:paymentDetail?.subscriberName,
              installmentMonth:paymentDetail?.installmentMonth,
              cancelled: paymentDetail?.cancelled,
              serialNumber:paymentDetail?.serialNumber

            };

            // Push to appropriate array based on cancelled status
            if (paymentDetail?.cancelled && !paymentDetail?.verified) {
              this.cancelled.push({
                ...formattedPayment,
                sno: cancelledSno++,
                deleteReason: paymentDetail?.deleteReason,
              });
            } else if (!paymentDetail?.cancelled && !paymentDetail?.verified) {
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
    this.paymentDetail=null
    this.showCancelledPayments = !this.showCancelledPayments;
   
  }
  getPaymentById(id: string): void {
    this.service.getPaymentById(id).subscribe(
      data => {
        this.paymentDetail = data;
      },
      error => {
      }
    );
  }

  column: ITableColumn[] = [
    {
      label: 'Serial No',
      field: 'sno',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Serial No',
      field: 'serialNumber',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Installment Month',
      field: 'installmentMonth',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Receipt Number',
      field: 'receiptNumber',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Subscriber Name',
      field: 'subscriberName',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Passbook Number',
      field: 'passbooknumber',
      filterList: true,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Group Id',
      field: 'groupId',
      filterList: true,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },

    {
      label: 'Amount Paid',
      field: 'amount',
      filterList: false,
      cellStyle: { color: '#12B76A' },
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
  ];

  columnCancelled: ITableColumn[] = [
    {
      label: 'Serial No',
      field: 'sno',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)

    },
    {
      label: 'Serial No',
      field: 'serialNumber',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Receipt Number',
      field: 'receiptNumber',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)

    },
    {
      label: 'Installment Month',
      field: 'installmentMonth',
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
    },
    {
      label: 'Passbook Number',
      field: 'passbooknumber',
      filterList: true,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)

    },
    {
      label: 'Group Id',
      field: 'groupId',
      filterList: true,
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)

    },

    {
      label: 'Amount Paid',
      field: 'amount',
      filterList: false,
      cellStyle: { color: 'red' },
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)

    },

    {
      label: 'Reason Cancellation',
      field: 'deleteReason',
      filterList: false,
      cellStyle: { color: 'red' },
      onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)

    },
  ];


  showModal(message: string): void {
    this.modalErrorMessage = message;
    const modal = document.getElementById('deleteTypeModal');
    modal.style.display = 'block';
  }
  deleteConfirm(id) {

    if (confirm) {
      this.paymentDetail.cancelled = true
      this.paymentDetail.deleteReason = this.reasonCancelForm.get('deleteReason')?.value
      let cancelled = this.paymentDetail
      this.service.savePaymentDetails(cancelled, id).subscribe(
        (response: any) => {
          this.popup = false
        },
      );
    }
    this.paymentDetail = null;
    this.getAllPayment();
    this.router.navigate(["/payment"]);
  }

  delete(id) {
    // if (confirm) {
      this.popup = true
      // this.modalErrorMessage = message;
      const modal = document.getElementById('deleteTypeModal');
      modal.style.display = 'block';
      // this.showModal("Do you want to delete?")
    // }
  }

  cancel() {
    this.paymentDetail = null
  }
  changeTab(tab: string) {
    this.activeTab = tab;
    this.getAllPayment()
  }
  closeModal(){
    this.popup = false

  }
}

