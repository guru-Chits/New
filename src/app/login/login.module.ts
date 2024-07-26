import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
<<<<<<< HEAD
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
=======
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
>>>>>>> d268cbebf1b018278c981a41646250751fc2f77c


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    VerifyComponent,
    ResetPasswordComponent,
    
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
<<<<<<< HEAD
    ReactiveFormsModule,
    HttpClientModule
=======
    ReactiveFormsModule
>>>>>>> d268cbebf1b018278c981a41646250751fc2f77c
  ]
})
export class LoginModule { }
