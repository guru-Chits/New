import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './area.component';
import { AreaCreateComponent } from './area-create/area-create.component';
import { RegionCreateComponent } from './region-create/region-create.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
   component: AreaComponent, 
   canActivate: [AuthGuard],
   data: { accKey: 'Route Manager'}
},
{
  path: 'routecreate',
  component: AreaCreateComponent, 
  canActivate: [AuthGuard],
  data: { accKey: 'Route Manager'}

},  
{
  path: 'regioncreate',
  component: RegionCreateComponent, 
  canActivate: [AuthGuard],
  data: { accKey: 'Route Manager'}

},
{
  path:'routeedit/:id',
  component:AreaCreateComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Route Manager'}

},
{
  path:'regionedit/:id',
  component:RegionCreateComponent,
  canActivate: [AuthGuard],
  data: { accKey: 'Route Manager' }

}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
