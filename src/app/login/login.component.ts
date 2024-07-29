import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
interface ILogin{
  employeeId:FormControl<string|null>
  password:FormControl<string|null>
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm : FormGroup<ILogin>
  employeePattern:RegExp= /^KNG-E\d{3,9}$/;
  employeeId: string;
  isemployeeIdEmpty: boolean = false;
  isRegisteredemployeeId: boolean = true;

  isPasswordVisible: boolean = false;

  /**
   * Check if the confirm password is visible
   */
  isConfirmPwdVisible: boolean = false;

  /**
   * Check if the password is empty
   */
  isPwdEmpty: boolean = true; // variable for check whether the password field is empty

  /**
   * Check if the confirm password is empty
   */
  isConfirmPwdEmpty: boolean = true;

  /**
   * Confirm password
   */
  confirmPassword: string; // variable for get  the userinput of Conform password

  /**
   * Check if the password is matched
   */
  // isPasswordMatched: string = "Yes";
  passwordsMatch: boolean = true;

  /**
   * Check if the password is reset
   */
  isPasswordReset: boolean = false;


  passwordPattern: RegExp = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

 constructor(private router: Router, private fb: FormBuilder){}

 get passwordControl() { return this.loginForm.get('password'); };

 get employeeIdControl() { return this.loginForm.get('employeeId'); };
 ngOnInit(): void {
  
  this.loginForm=this.fb.group({
    employeeId:['',[Validators.required, Validators.pattern(this.employeePattern)]],
    password:['',[Validators.required,Validators.pattern(this.passwordPattern),Validators.maxLength(12),Validators.minLength(8)],]
  })

  this.loginForm.get("password").valueChanges.subscribe(() => {
    const passwordControl = this.loginForm.get("password");

    if (passwordControl) {
      const isPwdEmpty = passwordControl.value.trim() === "";
      this.isPwdEmpty = isPwdEmpty;
    }
  });

}

togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
}

/**
 * Toggle confirm password visibility
 */
toggleconfirmPasswordVisibility(): void {
  this.isConfirmPwdVisible = !this.isConfirmPwdVisible;
}



onSubmit(){
  this.router.navigate(["/login"]);

}
}

