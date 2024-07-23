import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AreaCreateComponent } from './area-create/area-create.component';
import { RegionCreateComponent } from './region-create/region-create.component';


@NgModule({
  declarations: [
    AreaComponent,
    AreaCreateComponent,
    RegionCreateComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule
  ]
})
export class AreaModule { }
