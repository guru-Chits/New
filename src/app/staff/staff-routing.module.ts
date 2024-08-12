import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { StaffViewComponent } from './staff-view/staff-view.component';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent, 
  },
  {
    path: 'create',
    component: StaffCreateComponent, 
  },  
  {
    path: 'view/:id',
    component: StaffViewComponent, 
  },
  {
    path:'edit/:id',
    component:StaffCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
