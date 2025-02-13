import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridComponent } from './table/ag-grid/ag-grid.component';
import { BreadcrumbComponent } from './table/breadcrumb/breadcrumb.component';
import { AuthInterceptorService } from './interceptor/auth-interceptor.service'
import { HttpClientModule } from '@angular/common/http';
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
    BreadcrumbComponent,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthInterceptorService]
})
export class SharedModule { }
