import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface IForgotPassword {
  verifyCode:FormControl<string | null>
}
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit{
verifyForm:FormGroup<IForgotPassword>
constructor(private fb:FormBuilder,private router :Router){}
get verifyCodeControl() { return this.verifyForm.get('verifyCode'); };

ngOnInit(): void {
  this.verifyForm=this.fb.group({
    verifyCode:['',[Validators.required]]
  })
}

onSubmit(){
  this.router.navigate([ "login/reset-password"]);
}
}

