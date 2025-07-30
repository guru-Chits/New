import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../shared/serive/login.service';

interface IForgotPassword {
  verifyCode: FormControl<string | null>
}
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
  verifyForm: FormGroup<IForgotPassword>
  verifyPattern: RegExp = /^[0-9]$/;
  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient, private service: LoginService) { }
  get verifyCodeControl() { return this.verifyForm.get('verifyCode'); };
  @Input() mobileNumber: any
  @Input() reset: boolean
  @Input() employeeId: string
  resetPage: boolean = false
  mob: any

  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      verifyCode: ['', [Validators.required]]
    })
    this.mob = this.mobileNumber.slice(-3);
  }

onSubmit() {
  const payload = this.verifyForm.value;

  // Construct the verification URL
  const verificationUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/VERIFY3/${this.mobileNumber}/${payload.verifyCode}`;

  // Send GET request to verify OTP
  this.httpClient.get(verificationUrl).subscribe(
    (verificationResponse: any) => {
      if (verificationResponse.Status === 'Error') {
        window.alert("Invalid OTP, please try again.");
        this.verifyForm.reset();
      } else if (verificationResponse.Status === 'Success') {
        const role = localStorage.getItem('userRole')?.replace(/"/g, '').toLowerCase(); // Normalized

        this.service.markAsVerified();
        localStorage.setItem('isVerified', "Verified");

        if (this.reset === true) {
          this.resetPage = true;
          this.router.navigate(['/login/reset-password']); // ✅ navigate on reset
        } else if (role === "collection staff") {
          this.resetPage = false;
          this.router.navigate(['/payment']);
        } else if (role === "office staff") {
          this.resetPage = false;
          this.router.navigate(['/subscriber']);
        } else {
          this.resetPage = false;
          this.router.navigate(['/dashboard']);
        }
      }
    },
    (error) => {
      window.alert("Error verifying OTP, please try again later.");
    }
  );
}

  resetOtp() {
    const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;

    this.httpClient.get(otpUrl).subscribe(
      (otpResponse: any) => {
      },
      (error) => {
      }
    );

  }
  login() {
    window.location.reload();
  }
}

