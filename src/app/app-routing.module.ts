import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgGridComponent } from './shared/table/ag-grid/ag-grid.component';

const loginRoutes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'ag-grid',
    component:AgGridComponent
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(loginRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
