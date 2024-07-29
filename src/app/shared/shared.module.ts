import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTableComponent } from './components/list-table/list-table.component';
import { AgGridTableComponent } from './components/ag-grid-table/ag-grid-table.component';
import { AgGridAngular } from 'ag-grid-angular';
import { TabsComponent } from './components/tabs/tabs.component';


@NgModule({
  declarations: [
    ListTableComponent,
    AgGridTableComponent,
    TabsComponent
  ],
  imports: [
    CommonModule, 
    AgGridAngular
  ],
  exports: [
    ListTableComponent,
    AgGridTableComponent
  ]
})
export class SharedModule { }
