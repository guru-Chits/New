import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StaffService } from '../../staff/shared/service/staff.service';
import { AreaService } from '../../area/shared/service/area.service';
import { PaymentService } from '../shared/service/payment.service';
import { ITableColumn } from '../../shared/interface/list-table';
import { CellClickedEvent } from 'ag-grid-community';
import { AuthService } from '../../shared/service/auth.service';
import { ChitService } from '../../chit/shared/service/chit.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {
  Staffs: string[];
  Areas: string[];
  staffs: any
  addSubscriberTotal: number
  subscriberTotal: number
  data: any[] = [];
  routeData: any
  routes: any[] = []
  routeId: any
  totalAmount: any
  collectedAmount: any
  selectedStaff: any
  collectionForm: FormGroup
  date: Date
  paymentData: any = {};
  avlData: any[] = [];
  canData: any[] = [];
  paymentDetail: any
  filter: boolean = true
  canDelete: any
  searchImg: string = 'assets/table/black search.svg'
  filterImg: string = 'assets/table/black filter.svg'
  search: boolean = true
  showCancelledPayments = false;
  selectStaff: any
  paymentBody: any
  passbooknumber: any
  constructor(private formBuilder: FormBuilder,
    private staffService: StaffService,
    private routeService: AreaService,
    private service: PaymentService,
    private authService: AuthService,
    private chitService: ChitService
  ) { }
  ngOnInit(): void {

    this.collectionForm = this.formBuilder.group({
      date: ['', [Validators.required, this.validatePastOrTodayDate]],
      routeId: ['', [Validators.required]],
      selectedStaff: ['', [Validators.required]],
      collectionAmount: ['', [Validators.required]],
      amountCollected: ['', [Validators.required,]],
      balance: ['', [Validators.required, this.balanceValidator()]],
      serialNumberCount: ['', [Validators.required]],
      verifiedBy: ['', [Validators.required]],
      passbookno: this.formBuilder.array([]),
      verified: [false]
    });

    this.authService.checkAccess('Payments', 'delete').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canDelete = true
      }
    });

    this.staffs = localStorage.getItem('name')
    this.staffs = this.staffs.replace(/"/g, '')
    this.collectionForm.get('date').valueChanges.subscribe(date => {
      this.date = date;
      this.collectionForm.controls['routeId'].reset();
      this.collectionForm.controls['selectedStaff'].reset();
      this.service.getRouteByDate(this.date).subscribe(data => {
        this.routeData = data;
        this.routes = this.routeData.region.map((routeDetails, index) => ({
          routeId: routeDetails,
        }));
        this.collectionForm.get('routeId')?.valueChanges.subscribe(routeId => {
          this.routeId = routeId;
          this.service.getStaff(this.date, this.routeId).subscribe(data => {
            this.totalAmount = data;
            this.selectedStaff = this.totalAmount.selectStaff.map((details, index) => ({
              selectStaff: details
            }));
            this.collectionForm.get('selectedStaff')?.valueChanges.subscribe(selectStaff => {
              this.selectStaff = selectStaff
              this.service.getTotal(this.date, this.routeId, selectStaff).subscribe(amount => {
                this.collectedAmount = amount;
                this.getAllPayment(this.date, this.routeId, selectStaff)
                this.collectionForm.patchValue({
                  collectionAmount: this.collectedAmount.totalAmount,
                  serialNumberCount: this.collectedAmount.length,
                });
              });

              this.service.getPassbookNo(this.date, this.routeId, selectStaff).subscribe(passbookno => {
                this.passbooknumber = passbookno;
                this.passbooknumber = this.passbooknumber.passbooknumber
                const passbookArray = this.collectionForm.get('passbookno') as FormArray;
                passbookArray.clear();
                this.passbooknumber.forEach((pb: string) => {
                  passbookArray.push(this.formBuilder.control(pb));
                });
                this.collectionForm.get('verified').setValue(true);
              });
            });
          });
        });
      });
      this.collectionForm.get('amountCollected')?.valueChanges.subscribe(amountCollected => {
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
      if (value > 0 || value < 0) {
        return { invalidBalance: true };
      }
      return null;
    };
  }

  getAllPayment(date: Date, routeId: string, selectStaff: string) {
    this.service.getTotal(date, routeId, selectStaff).subscribe((data) => {
      this.paymentData = data;
      this.avlData = [];
      this.canData = [];
      let availableSno = 1;
      let cancelledSno = 1;
      if (this.paymentData.payments) {
        this.paymentData.payments.forEach((paymentDetail) => {
          const formattedPayment = {
            id: paymentDetail?._id,
            passbooknumber: paymentDetail?.passbooknumber,
            groupId: paymentDetail?.groupId,
            amount: paymentDetail?.amount,
            receiptNumber: paymentDetail?.receiptNumber,
            cancelled: paymentDetail?.cancelled,
            verified: true,
            chitAmount: paymentDetail?.chitAmount,
            region: paymentDetail?.region,
            subscriberId: paymentDetail?.subscriberId,
            subscriberName: paymentDetail?.subscribeName,
            installmentMonth: paymentDetail?.installmentMonth,
            selectStaff: paymentDetail?.selectStaff,
            serialNumber: paymentDetail?.serialNumber,
            date: paymentDetail?.date,
            collectionType: paymentDetail?.collectionType
          };
          if (paymentDetail?.cancelled) {
            this.canData.push({
              ...formattedPayment,
              sno: cancelledSno++,
            });

          } else if (!paymentDetail?.cancelled) {
            this.avlData.push({
              ...formattedPayment,
              sno: availableSno++,
            });
          }
        });
      }
    });


  }


  column: ITableColumn[] = [
    {
      label: 'Serial No',
      field: 'sno',
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
    },
    {
      label: 'Receipt Number',
      field: 'receiptNumber',
      filterList: false,
    },
    {
      label: 'Passbook Number',
      field: 'passbooknumber',
      filterList: true,
    },
    {
      label: 'Group Id',
      field: 'groupId',
      filterList: true,
    },

    {
      label: 'Amount Paid',
      field: 'amount',
      filterList: false,
      cellStyle: { color: 'red' },
    },
  ];

  togglePayments() {
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
  onSubmit() {
    const payload = this.collectionForm.value
    const balance = this.collectionForm.get('balance')?.value;
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
        approvedBy:this.collectionForm.get('verifiedBy')?.value
      };

      this.service.savePaymentDetails(this.paymentBody, payment.id).subscribe(
        (response) => {
          // this.chitService.getByPassbooNo(response.updateDetails.passbooknumber).subscribe((passbookData: any) => {
          //   if (passbookData.source === 'chitSubscribers') {
          //     // Sum up payments for chitSubscribers (convert amount to number explicitly)
          //     this.subscriberTotal=response.updateDetails.amount
          //     this.service.saveTransactionDetails(response.updateDetails.groupId, this.subscriberTotal).subscribe(
          //       (response)=>{
          //       }
          //     )
          //   } else if (passbookData.source === 'addChitSubscribers') {
          //     this.addSubscriberTotal=response.updateDetails.amount
          //     this.service.addWallet(response.updateDetails.groupId, this.addSubscriberTotal).subscribe(
          //       (response)=>{
          //         this.collectionForm.reset()
          //       }
          //     )
          //     // Sum up payments for addChitSubscribers (convert amount to number explicitly)
          //     // this.addSubscriberTotal = this.paymentBody.amount;
          //   }

          //  });
        },
        (error) => {
        }
      );
    });
    // Check if the balance is less than 0
    //  if (balance < 0) {
    //          this.collectionForm.disable();
    //    return; 
    //  }
    this.service.saveCollectionDetails(payload).subscribe((response: any) => {
      this.collectionForm.reset()

    })
    this.avlData = [];
    this.canData = [];
  }

  cancel() {
    this.paymentDetail = null
  }

  delete(id) {
    if (confirm('Are you sure you want to cancel this payment?')) {
      this.paymentDetail.cancelled = true;
      let cancelled = this.paymentDetail;
      this.service.savePaymentDetails(cancelled, id).subscribe(
        (response: any) => {
          this.refreshTableAndForm();
        },
        (error) => {
        }
      );
    }
    this.paymentDetail = null;
  }

  refreshTableAndForm() {
    this.getAllPayment(this.date, this.routeId, this.selectStaff);
    this.service.getTotal(this.date, this.routeId, this.selectStaff).subscribe((amount) => {
      this.collectedAmount = amount;
      this.collectionForm.patchValue({
        collectionAmount: this.collectedAmount.totalAmount,
        serialNumberCount: this.collectedAmount.length,
      });
    });
  }
}
