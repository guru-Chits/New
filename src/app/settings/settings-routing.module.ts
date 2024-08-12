import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from 'ag-grid-community';
import { SettingsComponent } from './settings.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { StaffManagerComponent } from './staff-manager/staff-manager.component';


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
 }
  ]
 },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
