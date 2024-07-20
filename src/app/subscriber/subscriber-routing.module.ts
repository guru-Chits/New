import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Subscriber } from 'rxjs';
import { SubscriberComponent } from './subscriber.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriberComponent, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
