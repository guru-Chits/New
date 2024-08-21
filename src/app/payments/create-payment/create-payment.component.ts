import { AfterViewInit, Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { IPaymentForm } from '../shared/interface/payment-form';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { PaymentService } from '../shared/service/payment.service';
@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent{
  Staffs: string[];

  paymentForm: FormGroup<IPaymentForm>;
  paymentData: any = {};  

  data: any[] = [];
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

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PaymentService) { }

  ngOnInit(): void {
this.getAllPayment()
  }

  
  getAllPayment() {
    this.service.getPaymentAll().subscribe((data)=>{
      this.paymentData=data;

      console.log("subscriber data",this.paymentData);
      this.data=this.paymentData.AllPayment.map((paymentDetail,index)=>({
        id:paymentDetail?._id,
        date: paymentDetail?.date,
        passbooknumber: paymentDetail?.passbooknumber,
        groupId: paymentDetail?.groupId,
        collectionType: paymentDetail?.collectionType,
        subscriberId: paymentDetail?.subscriberId,
        subscriberName: paymentDetail?.subscriberName,
        installmentNumber: paymentDetail?.installmentNumber,
        installmentMonth: paymentDetail?.installmentMonth,
        region: paymentDetail?.region,
        selectStaff: paymentDetail?.selectStaff,
        amount: paymentDetail?.amount,
        chitAmount: paymentDetail?.chitAmount,
        serialNumber: paymentDetail?.serialNumber,
        receiptNumber: paymentDetail?.receiptNumber,
        sno:index+1,
      }))
    })
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
    filter:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  {
    label: 'Group Id',
    field: 'groupId',
    filter:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },
  
  {
    label: 'Amount Paid',
    field: 'amount',
    filter:false,
    onCellClicked: (event: CellClickedEvent) => this.getPaymentById(event.data.id)
  },

];
 delete(id){
  if (confirm('Are you sure you want to delete this subscriber?')) {
    this.service.deletePayment(id).subscribe(
      response => {
        console.log('Subscriber deleted successfully', response);
        this.data = this.data.filter(s => s._id !== id);
      },
    );
  }
  this.paymentDetail=null
  this.getAllPayment()
  this.router.navigate(["/payment"]);


 }
 cancel(){
  this.paymentDetail=null
 }  
}
