import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './area.component';
import { AreaCreateComponent } from './area-create/area-create.component';
import { RegionCreateComponent } from './region-create/region-create.component';

const routes: Routes = [
  {
    path: '',
   component: AreaComponent, 
},
{
  path: 'areacreate',
  component: AreaCreateComponent, 
},  
{
  path: 'regioncreate',
  component: RegionCreateComponent, 
},
{
  path:'areaedit/:id',
  component:AreaCreateComponent
},
{
  path:'regionedit/:id',
  component:RegionCreateComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
