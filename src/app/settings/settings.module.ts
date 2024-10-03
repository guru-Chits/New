import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyComponent } from './privacy/privacy.component';
import { StaffManagerComponent } from './staff-manager/staff-manager.component';
import { SharedModule } from '../shared/shared.module';
import { CreateStaffComponent } from './create-staff/create-staff.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { CollectionTypeComponent } from './collection-type/collection-type.component';
import { ReasonDeletionComponent } from './reason-deletion/reason-deletion.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
   
  
    SettingsComponent,
             PrivacyComponent,
             StaffManagerComponent,
             CreateStaffComponent,
             CreateRoleComponent,
             CollectionTypeComponent,
             ReasonDeletionComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule
  ]
})
export class SettingsModule { }
