import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './shared/serive/login.service';
import { HttpClient } from '@angular/common/http';
import { AccessService } from '../access/service/access.service';
interface ILogin {
  employeeId: FormControl<string | null>
  password: FormControl<string | null>
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup<ILogin>
  employeePattern: RegExp = /^KNG-E\d{3,9}$/;
  employeeId: string;
  isemployeeIdEmpty: boolean = false;
  isRegisteredemployeeId: boolean = true;
  response: any
  password: any
  isPasswordVisible: boolean = false;
  newStaff: boolean = false
  /**
   * Check if the confirm password is visible
   */
  isConfirmPwdVisible: boolean = false;

  /**
   * Check if the password is empty
   */
  isPwdEmpty: boolean = true; // variable for check whether the password field is empty
  userdata: any
  /**
   * Check if the confirm password is empty
   */
  isConfirmPwdEmpty: boolean = true;
  verified: boolean = false
  role: any
  roleAccess: any
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
  reset: boolean

  mobileNumber: any
  passwordPattern: RegExp = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  constructor(private router: Router, private fb: FormBuilder, private service: LoginService, private HttpClient: HttpClient, private accessService: AccessService) { }

  get passwordControl() { return this.loginForm.get('password'); };

  get employeeIdControl() { return this.loginForm.get('employeeId'); };
  ngOnInit(): void {

    this.loginForm = this.fb.group({
      employeeId: ['', [Validators.required, Validators.pattern(this.employeePattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern), Validators.maxLength(12), Validators.minLength(8)],]
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

  toggleconfirmPasswordVisibility(): void {
    this.isConfirmPwdVisible = !this.isConfirmPwdVisible;
  }



  onSubmit() {
    const payload = this.loginForm.value;

    this.service.getLoginDetail(payload.employeeId).subscribe(response => {
      this.response = response
      if (!this.response.success) {
        alert("User Not found")
      }
      else {
        this.employeeId = this.response.user.employeeId
        let password = this.loginForm.get('password').value
        let empId = this.loginForm.get('employeeId').value

        if (password === "Staff@578" && this.response.user.password==="Staff@578") {
          this.userdata = response;
          this.mobileNumber = this.userdata.mobileNumber;

          const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;

          this.HttpClient.get(otpUrl).subscribe(
            (otpResponse: any) => {
              this.newStaff = true
              this.reset = true
            },
            (error) => {
            }
          );

        } else {
          if (this.response.success === true && password === this.response.user.password && empId == this.employeeId) {
            this.userdata = response;
            sessionStorage.setItem('profile', JSON.stringify(this.userdata.userProfile));
            sessionStorage.setItem('name', JSON.stringify(this.userdata.userName));

            this.mobileNumber = this.userdata.mobileNumber;
            this.role = this.userdata.role;
            sessionStorage.setItem('userRole', JSON.stringify(this.role));

            // Check if the user has access before proceeding
            this.accessService.getAccessByRole(this.role).subscribe(roleResponse => {
              this.roleAccess = roleResponse
              if (this.roleAccess && this.roleAccess.roleAccess.roleDetails) {
                const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;
            // this.router.navigate(['/subscriber']);  // Navigate after OTP success
 
                this.HttpClient.get(otpUrl).subscribe(
                  (otpResponse: any) => {
                    this.verified = true;
                  },
                  (error) => {
                  }
                );
              } else {
                alert('Access denied. Please contact admin.');
              }
            }, error => {
            });
          } else {
            alert("No user details found.");
          }
        }
      }
    }, error => {
    });
  }

}

