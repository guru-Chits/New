import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChitComponent } from './chit.component';

const routes: Routes = [
  {
      path: '',
     component: ChitComponent, 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChitRoutingModule { }
