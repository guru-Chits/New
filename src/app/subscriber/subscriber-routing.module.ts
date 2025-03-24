import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Subscriber } from 'rxjs';
import { SubscriberComponent } from './subscriber.component';
import { SubscriberCreateComponent } from './subscriber-create/subscriber-create.component';
import { SubscriberViewComponent } from './subscriber-view/subscriber-view.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SubscriberComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Subscriber Management', action: 'view' }
  },
  {
    path: 'create',
    component: SubscriberCreateComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Subscriber Management', action: 'create' }
  },
  {
    path: 'view/:id',
    component: SubscriberViewComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Subscriber Management', action: 'view' }
  },
  {
    path: 'edit/:id',
    component: SubscriberCreateComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Subscriber Management', action: 'edit' }
  },
  {
    path: 'delete/:id',
    component: SubscriberCreateComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Subscriber Management', action: 'delete' }
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
