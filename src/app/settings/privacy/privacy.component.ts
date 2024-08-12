import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface IResetPassword {
  newPassword:FormControl<string | null>
  confirmPassword:FormControl<string|null>
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent implements OnInit {

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

    get newPasswordControl() { return this.resetForm.get('newPassword'); };
  get confirmPasswordControl() { return this.resetForm.get('confirmPassword'); };

  resetForm: FormGroup<IResetPassword>
 constructor(private fb:FormBuilder,private router: Router, ){}

ngOnInit(): void {
  this.resetForm=this.fb.group({
    newPassword: [
      "",
      [Validators.required,Validators.pattern(this.passwordPattern),Validators.maxLength(12),Validators.minLength(8)],
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
  this.passwordsMatch =
  this.resetForm.get("newPassword").value ===
  this.resetForm.get("confirmPassword").value;
 
  if (this.passwordsMatch) {

  this.isPasswordReset = true;
  }
}
navigateToLoginPage(): void {
  this.router.navigate(["/login"]);
}
}
