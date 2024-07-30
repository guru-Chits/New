import { AfterViewInit, Component } from '@angular/core';

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

  onSubmit(){

  }


  columns: ITableColumn[] = [
    { label: 'Serial Number', field: 'serialNum', sortable: true },
    { label: 'Receipt Number', field: 'receiptNum', sortable: true },
    { label: 'Passbook Number', field: 'passbookNum', sortable: true },
    { label: 'Group ID', field: 'groupId', sortable: true },
    { label: 'Amount', field: 'amount', sortable: true }
  ];
}
