import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridComponent } from './table/ag-grid/ag-grid.component';


@NgModule({
  declarations: [
AgGridComponent
  ],
  imports: [
    CommonModule, 
    AgGridAngular
  ],
  exports: [
    AgGridComponent

  ]
})
export class SharedModule { }
