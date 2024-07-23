import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { StaffViewComponent } from './staff-view/staff-view.component';


@NgModule({
  declarations: [
    StaffComponent,
    StaffCreateComponent,
    StaffViewComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule
  ]
})
export class StaffModule { }
