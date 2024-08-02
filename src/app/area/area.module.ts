import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AreaCreateComponent } from './area-create/area-create.component';
import { RegionCreateComponent } from './region-create/region-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AreaComponent,
    AreaCreateComponent,
    RegionCreateComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    SharedModule
  ]
})
export class AreaModule { }
