import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridComponent } from './table/ag-grid/ag-grid.component';

@NgModule({
  declarations: [
AgGridComponent,
  ],
  imports: [
    CommonModule, 
    AgGridAngular
  ],
  exports: [
    AgGridComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
