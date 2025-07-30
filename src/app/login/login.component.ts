import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './shared/serive/login.service';
import { HttpClient } from '@angular/common/http';
import { AccessService } from '../access/service/access.service';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private router: Router, private fb: FormBuilder, private service: LoginService, private HttpClient: HttpClient, private accessService: AccessService,private toastr: ToastrService) { }

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

onSubmit(): void {
  const payload = this.loginForm.value;
  const empId = payload.employeeId;
  const password = payload.password;

  this.service.login( { employeeId: payload.employeeId, password: payload.password }).subscribe({
    next: (response:any) => {
      this.response = response;

      if (!response.success) {  
        this.toastr.warning("User not found")

        return;
      }
      
      localStorage.setItem('accessToken', response.accessToken);
      this.employeeId = response.user.employeeId;

      // Case 1: New staff with default password
      if (password === "Staff@578" && response.success) {
        this.userdata = response;
        this.mobileNumber = response.mobileNumber;

        const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;

        this.HttpClient.get(otpUrl).subscribe({
          next: (otpResponse: any) => {
            this.newStaff = true;
            this.reset = true;
            this.toastr.success("OTP Send Successfully!")
          },
          error: (err) => {
            this.toastr.warning("Failed to send OTP")
          }
        });

        return;
      }

      // Case 2: Existing user with correct credentials
      if (response.success) {
        this.userdata = response;
        this.mobileNumber = response.mobileNumber;
        this.role = response.role;

        localStorage.setItem('profile', JSON.stringify(response.user.userProfile));
        localStorage.setItem('name', JSON.stringify(response.user.userName));
        localStorage.setItem('userRole', JSON.stringify(this.role));

        // Check access based on role
        this.accessService.getAccessByRole(this.role).subscribe({
          next: (roleResponse) => {
            this.roleAccess = roleResponse;

            if (this.roleAccess?.roleAccess?.roleDetails) {
              const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;

              this.HttpClient.get(otpUrl).subscribe({
                next: (otpResponse: any) => {
                  this.verified = true;
                  this.toastr.success("OTP Send Successfully!")
                },
                error: (err) => {
                  this.toastr.warning("OTP failed for existing user")
                }
              });
            } else {
              alert('Access denied. Please contact admin.');
            }
          },
          error: (err) => {
           this.toastr.error("Wrong credentials.")
          }
        });
      } else {
      this.toastr.error("Wrong credentials.")
      }
    },
    error: (err) => {
      this.toastr.error("Wrong credentials.")
    }
  });
}



}

