import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface IForgotPassword {
  employeeId:FormControl<string | null>
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm:FormGroup<IForgotPassword>;


  employeeId: string;
  isemployeeIdEmpty: boolean = false;
  isRegisteredemployeeId: boolean = true;
 constructor(private router: Router, private fb: FormBuilder){}

 get employeeIdControl() { return this.forgotPasswordForm.get('employeeId'); };
 ngOnInit(): void {
  
  this.forgotPasswordForm=this.fb.group({
    employeeId:['',[Validators.required]]
  })
}

onSubmit(){
  this.router.navigate([ "login/verify"]);
  console.log('lodin')
}
}
