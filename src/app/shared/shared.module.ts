import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridComponent } from './table/ag-grid/ag-grid.component';
import { BreadcrumbComponent } from './table/breadcrumb/breadcrumb.component';
import { AuthInterceptorService } from './interceptor/auth-interceptor.service'
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './loader/loader/loader.component';
@NgModule({
  declarations: [
AgGridComponent,
BreadcrumbComponent,
LoaderComponent,

  ],
  imports: [
    CommonModule, 
    AgGridAngular
  ],
  exports: [
    AgGridComponent,
    BreadcrumbComponent,
    HttpClientModule,
    LoaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthInterceptorService]
})
export class SharedModule { }
