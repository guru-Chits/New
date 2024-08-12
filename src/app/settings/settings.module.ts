import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyComponent } from './privacy/privacy.component';
import { StaffManagerComponent } from './staff-manager/staff-manager.component';



@NgModule({
  declarations: [
   
  
    SettingsComponent,
             PrivacyComponent,
             StaffManagerComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
