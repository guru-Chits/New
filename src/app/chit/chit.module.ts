import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChitRoutingModule } from './chit-routing.module';
import { ChitComponent } from './chit.component';
import { ChitCreateComponent } from './chit-create/chit-create.component';
import { ChitViewComponent } from './chit-view/chit-view.component';
import { AuctionSidebarComponent } from './auction-sidebar/auction-sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { AuctionComponent } from './auction/auction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChitComponent,
    ChitCreateComponent,
    ChitViewComponent,
    AuctionSidebarComponent,
    AuctionComponent
  ],
  imports: [
    CommonModule,
    ChitRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class ChitModule { }
