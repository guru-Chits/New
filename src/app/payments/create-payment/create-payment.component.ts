import { AfterViewInit, Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { IPaymentForm } from '../shared/interface/payment-form';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.css'
})
export class CreatePaymentComponent{
  Staffs: string[];
  data: any = [];
  searchImg:string='assets/table/black search.svg'
  filterImg:string='assets/table/black filter.svg'
  search:boolean=true
  onSubmit(){

  }

  columns: ColDef[] = [
    { field: 'serialNum', headerName: 'Serial Number', sortable: true },
    { field: 'receiptNum', headerName: 'Receipt Number', sortable: true },
    { field: 'passbookNum', headerName: 'Passbook Number', sortable: true },
    { field: 'groupID', headerName: 'Group ID', sortable: true },
    { field: 'amountPaid', headerName: 'Amount Paid', sortable: true }
  ];
  
  rowData = [
  ]
}
