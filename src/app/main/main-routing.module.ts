import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { SubscriberComponent } from '../subscriber/subscriber.component';
import { ChitComponent } from '../chit/chit.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'subscriber',
        loadChildren: () => import('../../app/subscriber/subscriber.module').then(m => m.SubscriberModule),
        canActivate: [AuthGuard],
        data: {accKey: 'Subscriber Management'},

      },
      {
        path: 'chit',
        loadChildren: () => import('../../app/chit/chit.module').then(m => m.ChitModule),
        canActivate: [AuthGuard],
        data: {accKey: 'Chit Management'},

      },
      {
        path: 'staff',
        loadChildren: () => import('../../app/staff/staff.module').then(m => m.StaffModule),
        canActivate: [AuthGuard],
        data: { accKey: 'Staffs' },

      },
      {
        path: 'payment',
        loadChildren: () => import('../../app/payments/payments.module').then(m => m.PaymentsModule),
        canActivate: [AuthGuard],
        data: { accKey: 'Payments'},
      },
      {
        path: 'area',
        loadChildren: () => import('../../app/area/area.module').then(m => m.AreaModule),
        canActivate: [AuthGuard],
        data: { accKey: 'Route Manager'},
      },
      {
        path: 'settings',
        loadChildren: () => import('../../app/settings/settings.module').then(m => m.SettingsModule),
        data: { accKey: 'Settings' },
        canActivate: [AuthGuard]
      },
      {
        path: 'access',
        loadChildren: () => import('../../app/access/access.module').then(m => m.AccessModule),
        canActivate: [AuthGuard] // Optional, if needed for access control
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
