import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
// import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AgGridComponent } from './table/ag-grid/ag-grid.component';
@NgModule({
  declarations: [
    AgGridComponent    
  ],
  imports: [
    CommonModule,
    AgGridAngular,
    FormsModule ,

  ],
  exports: [
    AgGridComponent,
  ],
})
export class SharedModule { }
