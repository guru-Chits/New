import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Subscriber } from 'rxjs';
import { SubscriberComponent } from './subscriber.component';
import { SubscriberCreateComponent } from './subscriber-create/subscriber-create.component';
import { SubscriberViewComponent } from './subscriber-view/subscriber-view.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriberComponent, 
  },
  {
    path: 'create',
    component: SubscriberCreateComponent, 
  },
  {
    path: 'view',
    component: SubscriberViewComponent, 
  },
  {
    path:'edit/:id',
    component:SubscriberCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
