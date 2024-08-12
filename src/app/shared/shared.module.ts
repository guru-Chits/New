import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridComponent } from './table/ag-grid/ag-grid.component';
import { BreadcrumbComponent } from './table/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
AgGridComponent,
BreadcrumbComponent,
  ],
  imports: [
    CommonModule, 
    AgGridAngular
  ],
  exports: [
    AgGridComponent,
    BreadcrumbComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
