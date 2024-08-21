import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments/payments.component';
import { CollectionsComponent } from './collections/collections.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PaymentsComponent,
    CollectionsComponent,
    TransactionsComponent,
    CreatePaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [

  ]
})
export class PaymentsModule { }
