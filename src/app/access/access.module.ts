import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessRoutingModule } from './access-routing.module';
import { AccessManagementComponent } from './access-management/access-management.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AccessManagementComponent
  ],
  imports: [
    CommonModule,
    AccessRoutingModule,
    SharedModule,
    HttpClientModule
  ]
})
export class AccessModule { }
