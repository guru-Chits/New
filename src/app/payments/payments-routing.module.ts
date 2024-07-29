import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments/payments.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CollectionsComponent } from './collections/collections.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';

const routes: Routes = [
  {
    path: '',
    component:CreatePaymentComponent, 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
