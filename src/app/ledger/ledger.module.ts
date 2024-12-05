import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgerRoutingModule } from './ledger-routing.module';
import { LedgerComponent } from './ledger.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    LedgerComponent
  ],
  imports: [
    CommonModule,
    LedgerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  
})
export class LedgerModule { }
