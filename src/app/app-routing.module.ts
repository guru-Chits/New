import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loginRoutes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(loginRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
