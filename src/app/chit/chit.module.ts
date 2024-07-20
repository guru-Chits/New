import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChitRoutingModule } from './chit-routing.module';
import { ChitComponent } from './chit.component';


@NgModule({
  declarations: [
    ChitComponent
  ],
  imports: [
    CommonModule,
    ChitRoutingModule
  ]
})
export class ChitModule { }
