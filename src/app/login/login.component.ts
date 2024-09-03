import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './shared/serive/login.service';
import { HttpClient } from '@angular/common/http';
import { AccessService } from '../access/service/access.service';
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
 userdata:any
  /**
   * Check if the confirm password is empty
   */
  isConfirmPwdEmpty: boolean = true;
 verified:boolean=false
 role:any
 roleAccess:any
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
 
  mobileNumber:any
  passwordPattern: RegExp = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

 constructor(private router: Router, private fb: FormBuilder,private service:LoginService,private HttpClient:HttpClient,private accessService:AccessService){}

 get passwordControl() { return this.loginForm.get('password'); };

 get employeeIdControl() { return this.loginForm.get('employeeId'); };
 ngOnInit(): void {
  
  this.loginForm=this.fb.group({
    employeeId:['',[Validators.required, Validators.pattern(this.employeePattern)]],
    password:['']
    // password:['',[Validators.required,Validators.pattern(this.passwordPattern),Validators.maxLength(12),Validators.minLength(8)],]
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



onSubmit() {
  console.log("Login initiated");
  
  const payload = this.loginForm.value;
  
  this.service.getLoginDetail(payload.employeeId).subscribe(response => {
    console.log("User details fetched:", response);

    if (response) {
      this.userdata = response;
      sessionStorage.setItem('profile', JSON.stringify(this.userdata.userProfile));
      sessionStorage.setItem('name', JSON.stringify(this.userdata.userName));
      
      this.mobileNumber = this.userdata.mobileNumber;
      this.role = this.userdata.role;
      sessionStorage.setItem('userRole', JSON.stringify(this.role));

      // Check if the user has access before proceeding
      this.accessService.getAccessByRole(this.role).subscribe(roleResponse => {
        this.roleAccess=roleResponse
        if ( this.roleAccess && this.roleAccess.roleAccess.roleDetails) {
          console.log("Role access granted:", roleResponse);
              this.router.navigate(['/']); // Navigate after OTP success

          // const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;

          // // Send OTP
          // this.HttpClient.get(otpUrl).subscribe(
          //   (otpResponse: any) => {
          //     console.log('OTP sent successfully:', otpResponse);
          //     this.verified = true;
          //     this.router.navigate(['/']); // Navigate after OTP success
          //   },
          //   (error) => {
          //     console.error('Error sending OTP:', error);
          //   }
          // );
        } else {
          console.log("No role access, denying login.");
          alert('Access denied. Please contact admin.');
          // Optionally, you can clear the form or perform other actions
        }
      }, error => {
        console.error("Error fetching role access:", error);
      });
    } else {
      console.log("No user details found.");
    }
  }, error => {
    console.error("Error fetching login details:", error);
  });
}

}

