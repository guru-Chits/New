import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { StaffViewComponent } from './staff-view/staff-view.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewallComponent } from './viewall/viewall.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    StaffComponent,
    StaffCreateComponent,
    StaffViewComponent,
    ViewallComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class StaffModule { }
