import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments/payments.component';
import { CollectionsComponent } from './collections/collections.component';
import { TransactionsComponent } from './transactions/transactions.component';


@NgModule({
  declarations: [
    PaymentsComponent,
    CollectionsComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule
  ]
})
export class PaymentsModule { }
