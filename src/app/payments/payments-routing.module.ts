import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments/payments.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CollectionsComponent } from './collections/collections.component';

const routes: Routes = [
  {
    path: '',
    component:PaymentsComponent, 
  },
  {
    path:'transactions',
    component:TransactionsComponent, 
  },
  {
    path:'collections',
    component:CollectionsComponent, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
