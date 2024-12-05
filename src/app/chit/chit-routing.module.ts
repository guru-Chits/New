import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChitComponent } from './chit.component';
import { ChitCreateComponent } from './chit-create/chit-create.component';
import { ChitViewComponent } from './chit-view/chit-view.component';
import { AuctionComponent } from './auction/auction.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
      path: '',
     component: ChitComponent, 
     canActivate: [AuthGuard],
     data: { accKey: 'Chit Management', action: 'view' }

  },
  {
    path: 'create',
    component: ChitCreateComponent, 
    canActivate: [AuthGuard],
    data: { accKey: 'Chit Management', action: 'create' }

  },  
  {
    path: 'view/:id',
    component: ChitViewComponent, 
    canActivate: [AuthGuard],
    data: { accKey: 'Chit Management', action: 'view' }

  },
  {
    path:'edit/:id',
    component:ChitCreateComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Chit Management', action: 'edit' }

  },
  {
    path:'auction/:id',
    component:AuctionComponent,
    canActivate: [AuthGuard],
    data: { accKey: 'Chit Management', action: 'edit' }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChitRoutingModule { }
