import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface IResetPassword {
  newPassword:FormControl<string | null>
  confirmPassword:FormControl<string|null>
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  passwordPattern: RegExp =
  /^(?=.*[-\#\$\.\%\&\@\!\+\=\<\>\*])(?=.*[a-zA-Z])(?=.*\d).{8}$/;

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


  get newPasswordControl() { return this.resetForm.get('newPassword'); };
  get confirmPasswordControl() { return this.resetForm.get('confirmPassword'); };

  resetForm: FormGroup<IResetPassword>
 constructor(private fb:FormBuilder){}

ngOnInit(): void {
  this.resetForm=this.fb.group({
    newPassword: [
      "",
      [Validators.required, Validators.pattern(this.passwordPattern)],
    ],
    confirmPassword: [
      "",
      [Validators.required, Validators.pattern(this.passwordPattern)],
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

}

}
