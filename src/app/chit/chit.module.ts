import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChitRoutingModule } from './chit-routing.module';
import { ChitComponent } from './chit.component';
import { ChitCreateComponent } from './chit-create/chit-create.component';
import { ChitViewComponent } from './chit-view/chit-view.component';
import { AuctionSidebarComponent } from './auction-sidebar/auction-sidebar.component';
// import { SharedModule } from '../shared/shared.module';
import { AuctionComponent } from './auction/auction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfitComponent } from './profit/profit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { TknComponent } from './tkn/tkn.component';
import { ExtraComponent } from './extra/extra.component';
import { ProfitChitComponent } from './profit-chit/profit-chit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ChitComponent,
    ChitCreateComponent,
    ChitViewComponent,
    AuctionComponent,
    AuctionSidebarComponent,
    ProfitComponent,
    PurchaseComponent,
    TknComponent,
    ExtraComponent,
    ProfitChitComponent
  ],
  imports: [
    CommonModule,
    ChitRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  exports: [
    AuctionSidebarComponent
  ]
})
export class ChitModule { }
