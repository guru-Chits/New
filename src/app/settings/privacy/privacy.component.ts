import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../login/shared/serive/login.service';

interface IResetPassword {
  newPassword: FormControl<string | null>
  confirmPassword: FormControl<string | null>
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent implements OnInit {

  isPasswordVisible: boolean = false;
  isCurPasswordVisible: boolean = false;
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
  isCurrentwdEmpty: boolean = true;
  /**
   * Confirm password
   */
  isPasswordMismatch: boolean = false;

  confirmPassword: string; // variable for get  the userinput of Conform password
  userDetail: any
  /**
   * Check if the password is matched
   */
  // isPasswordMatched: string = "Yes";
  passwordsMatch: boolean = true;

  /**
   * Check if the password is reset
   */
  isPasswordReset: boolean = false;
  password: any
  employeeId: any

  passwordPattern: RegExp = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  get currentPasswordControl() { return this.resetForm.get('currentPassword'); };
  get newPasswordControl() { return this.resetForm.get('newPassword'); };
  get confirmPasswordControl() { return this.resetForm.get('confirmPassword'); };

  resetForm: FormGroup
  constructor(private fb: FormBuilder, private router: Router, private service: LoginService) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      currentPassword: [
        "", [Validators.required, Validators.maxLength(12), Validators.minLength(8), Validators.pattern(this.passwordPattern)]
      ],
      newPassword: [
        "",
        [Validators.required, Validators.pattern(this.passwordPattern), Validators.maxLength(12), Validators.minLength(8)],
      ],
      confirmPassword: [
        "",
        [Validators.required],
      ],


    });
    this.resetForm.get("newPassword").valueChanges.subscribe(() => {
      const newPasswordControl = this.resetForm.get("newPassword");

      if (newPasswordControl) {
        const isPwdEmpty = newPasswordControl.value.trim() === "";
        this.isPwdEmpty = isPwdEmpty;
      }
    });

    this.resetForm.get("confirmPassword").valueChanges.subscribe(() => {
      const newConformPasswordControl =
        this.resetForm.get("confirmPassword");

      if (newConformPasswordControl) {
        const isConfirmPwdEmpty = newConformPasswordControl.value.trim() === "";
        this.isConfirmPwdEmpty = isConfirmPwdEmpty;
      }
    });

    this.resetForm.get("currentPassword").valueChanges.subscribe(() => {
      const currentPasswordControl =
        this.resetForm.get("currentPassword");

      if (currentPasswordControl) {
        const isCurrentwdEmpty = currentPasswordControl.value.trim() === "";
        this.isCurrentwdEmpty = isCurrentwdEmpty;
      }
    });

    this.employeeId = localStorage.getItem('employeeId')
    this.employeeId = this.employeeId.replace(/"/g, '')

    this.service.getLoginDetail(this.employeeId).subscribe(response => {
      this.userDetail = response;

      // Listen for changes on the currentPassword control
      this.resetForm.get("currentPassword").valueChanges.subscribe(currentPassword => {
        this.password = this.userDetail.password;

        // Check if passwords match
        this.isPasswordMismatch = currentPassword !== this.password;
      });
    });
  }

  togglePasswordVisibility(): void {
    this.isCurPasswordVisible = !this.isCurPasswordVisible;
  }

  toggleRePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  /**
   * Toggle confirm password visibility
   */
  toggleconfirmPasswordVisibility(): void {
    this.isConfirmPwdVisible = !this.isConfirmPwdVisible;
  }



  onSubmit() {
    let employeeId = localStorage.getItem('employeeId')
    employeeId = employeeId.replace(/"/g, '')

    this.service.getLoginDetail(employeeId).subscribe(response => {

      this.userDetail = response
      const currentPassword = this.resetForm.get("currentPassword").value;
      const password = this.userDetail.password

      if (currentPassword === password) {
        this.isPasswordMismatch = false;
      } else {
        this.isPasswordMismatch = true;
        // alert("not correct")
      }

    })
    this.passwordsMatch =
      this.resetForm.get("newPassword").value ===
      this.resetForm.get("confirmPassword").value;


    if (this.passwordsMatch) {

      if (this.resetForm.valid) {
        const password = this.resetForm.get("confirmPassword").value
        this.service.passwordReset(employeeId, password).subscribe(
          response => {
            this.isPasswordReset = true;

          },
          error => {
            console.error('Error resetting password', error);
          }
        );
      }
    }
  }

}
