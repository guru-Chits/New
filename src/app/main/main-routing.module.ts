import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { SubscriberComponent } from '../subscriber/subscriber.component';
import { ChitComponent } from '../chit/chit.component';

const routes: Routes = [
  { 
    path:'',
    component: MainComponent,
    children:[
      {
        path:'subscriber',
        loadChildren: () => import('../../app/subscriber/subscriber.module').then(m => m.SubscriberModule)
      },
      {
        path:'chit',
        loadChildren: () => import('../../app/chit/chit.module').then(m => m.ChitModule)
      },
      {
        path:'staff',
        loadChildren: () => import('../../app/staff/staff.module').then(m => m.StaffModule)
      },
      {
        path:'payment',
        loadChildren: () => import('../../app/payments/payments.module').then(m => m.PaymentsModule)
      },
      {
        path:'area',
        loadChildren: () => import('../../app/area/area.module').then(m => m.AreaModule)
      },
      {
        path:'settings',
        loadChildren: () => import('../../app/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path:'access',
        loadChildren: () => import('../../app/access/access.module').then(m => m.AccessModule)
      }
    ]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
