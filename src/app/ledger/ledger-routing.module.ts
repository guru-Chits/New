import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LedgerComponent } from './ledger.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LedgerComponent, 
    canActivate: [AuthGuard],
    data: { accKey: 'Settings', action: 'view' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerRoutingModule { }
