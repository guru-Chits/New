import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChitComponent } from './chit.component';
import { ChitCreateComponent } from './chit-create/chit-create.component';
import { ChitViewComponent } from './chit-view/chit-view.component';
import { AuctionComponent } from './auction/auction.component';

const routes: Routes = [
  {
      path: '',
     component: ChitComponent, 
  },
  {
    path: 'create',
    component: ChitCreateComponent, 
  },  
  {
    path: 'view',
    component: ChitViewComponent, 
  },
  {
    path:'edit/:id',
    component:ChitCreateComponent
  },
  {
    path:'auction',
    component:AuctionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChitRoutingModule { }
