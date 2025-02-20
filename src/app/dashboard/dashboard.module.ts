import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuctionSidebarComponent } from '../chit/auction-sidebar/auction-sidebar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChitModule } from '../chit/chit.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AuctionSidebarComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ChitModule
  ],
  exports:[
    DashboardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
