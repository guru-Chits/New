import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChitRoutingModule } from './chit-routing.module';
import { ChitComponent } from './chit.component';
import { ChitCreateComponent } from './chit-create/chit-create.component';
import { ChitViewComponent } from './chit-view/chit-view.component';
import { AuctionSidebarComponent } from './auction-sidebar/auction-sidebar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ChitComponent,
    ChitCreateComponent,
    ChitViewComponent,
    AuctionSidebarComponent
  ],
  imports: [
    CommonModule,
    ChitRoutingModule,
    SharedModule
  ]
})
export class ChitModule { }
