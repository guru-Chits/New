import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChitRoutingModule } from './chit-routing.module';
import { ChitComponent } from './chit.component';
import { ChitCreateComponent } from './chit-create/chit-create.component';
import { ChitViewComponent } from './chit-view/chit-view.component';


@NgModule({
  declarations: [
    ChitComponent,
    ChitCreateComponent,
    ChitViewComponent
  ],
  imports: [
    CommonModule,
    ChitRoutingModule
  ]
})
export class ChitModule { }
