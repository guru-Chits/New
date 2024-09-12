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
import { AuthGuard } from '../shared/guard/auth.guard';


const routes: Routes = [
 {
  path:"",
  component:SettingsComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},

  children:[
  
 {
  path:"privacy",
  component:PrivacyComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},


 },
 {
  path:"staff-manager",
  component:StaffManagerComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},

 },
 {
  path:"create-staff",
  component:CreateStaffComponent
  ,  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},

 },
 {
  path:"create-role",
  component:CreateRoleComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},

 },
 {
  path:"collection-type",
  component:CollectionTypeComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},

 },
 {
  path:"reason-deletion",
  component:ReasonDeletionComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Settings', action: 'create'},

 }
  ]
 },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
