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
        component: SubscriberComponent,
        loadChildren: () => import('../../app/subscriber/subscriber.module').then(m => m.SubscriberModule)
      },
      {
        path:'chit',
        component: ChitComponent,
        loadChildren: () => import('../../app/chit/chit.module').then(m => m.ChitModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
