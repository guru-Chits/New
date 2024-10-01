import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../shared/serive/login.service';

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
verifyPattern:RegExp=/^[0-9]$/;
constructor(private fb:FormBuilder,private router :Router,private httpClient:HttpClient,private  service:LoginService){}
get verifyCodeControl() { return this.verifyForm.get('verifyCode'); };
@Input() mobileNumber:number
@Input() reset:boolean
@Input() employeeId:string
resetPage:boolean=false


ngOnInit(): void {
  this.verifyForm=this.fb.group({
    verifyCode:['',[Validators.required]]
  })
}

onSubmit(){
  const payload = this.verifyForm.value;
  console.log(payload.verifyCode);
  console.log(this.reset);

  // Prepare the URL with the mobile number and verifyCode
  const verificationUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/VERIFY3/${this.mobileNumber}/${payload.verifyCode}`;
  
  // Send the request to verify the OTP
  this.httpClient.get(verificationUrl).subscribe(
    (verificationResponse: any) => {
      console.log('OTP verified successfully:', verificationResponse);
      if (verificationResponse.Status === 'Error') {
        window.alert("Invalid OTP, please try again.");
        this.verifyForm.reset();  // Optionally reset the form
      } else if (verificationResponse.Status === 'Success') {
        const role = sessionStorage.getItem('userRole')?.replace(/"/g, '');  // Clean up stored role string
        this.service.markAsVerified();
        sessionStorage.setItem('isVerified',"Verified" );
        console.log(this.reset);

        if(this.reset===true){
          this.resetPage=true
          // this.router.navigate(['/login/reset-password']);

        }

        else if (role === "Collection Staff") {
          this.router.navigate(['/payment']);
        } else {
          this.router.navigate(['/subscriber']);  // Navigate after OTP success
        }
      }
    },
    (error) => {
      console.error('Error verifying OTP:', error);
      window.alert("Error verifying OTP, please try again later.");
    }
  );
  
}
}

