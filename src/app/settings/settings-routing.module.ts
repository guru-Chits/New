import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from 'ag-grid-community';
import { SettingsComponent } from './settings.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { StaffManagerComponent } from './staff-manager/staff-manager.component';
import { CreateStaffComponent } from './create-staff/create-staff.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { CollectionTypeComponent } from './collection-type/collection-type.component';
import { ReasonDeletionComponent } from './reason-deletion/reason-deletion.component';


const routes: Routes = [
 {
  path:"",
  component:SettingsComponent,
  children:[
  
 {
  path:"privacy",
  component:PrivacyComponent
 },
 {
  path:"staff-manager",
  component:StaffManagerComponent
 },
 {
  path:"create-staff",
  component:CreateStaffComponent
 },
 {
  path:"create-role",
  component:CreateRoleComponent
 },
 {
  path:"collection-type",
  component:CollectionTypeComponent
 },
 {
  path:"reason-deletion",
  component:ReasonDeletionComponent
 }
  ]
 },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
