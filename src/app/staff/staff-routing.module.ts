import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { StaffViewComponent } from './staff-view/staff-view.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent, 
    canActivate: [AuthGuard],
    data: { accKey: 'Staffs', action: 'view' }

  },
  {
    path: 'create',
    component: StaffCreateComponent, 
    canActivate: [AuthGuard],
    data: { accKey: 'Staffs', action: 'create' }
  },  
  {
    path: 'view/:id',
    component: StaffViewComponent, 
    canActivate: [AuthGuard],
    data: { accKey: 'Staffs', action: 'view' }

  },
  {
    path:'edit/:id',
    component:StaffCreateComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Staffs', action: 'edit' }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
