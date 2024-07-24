import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "verify",
    component: VerifyComponent,
  },
  {
    path:"reset-password",
    component:ResetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
