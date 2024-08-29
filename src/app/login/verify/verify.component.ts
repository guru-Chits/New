import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
constructor(private fb:FormBuilder,private router :Router,private httpClient:HttpClient){}
get verifyCodeControl() { return this.verifyForm.get('verifyCode'); };
@Input() mobileNumber:number
ngOnInit(): void {
  this.verifyForm=this.fb.group({
    verifyCode:['',[Validators.required]]
  })
}

onSubmit(){
  const payload = this.verifyForm.value;
  console.log(payload.verifyCode);
  
  // Prepare the URL with the mobile number and verifyCode
  const verificationUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/VERIFY3/${this.mobileNumber}/${payload.verifyCode}`;
  
  // Send the request to verify the OTP
  this.httpClient.get(verificationUrl).subscribe(
    (verificationResponse: any) => {
      console.log('OTP verified successfully:', verificationResponse);
      if (verificationResponse.Status=='Error') {
        window.alert("invalid")
      }
      else if(verificationResponse.Status=='Success'){
        this.router.navigate([ "/","subscriber"]);
      }
    },
    (error) => {
      console.error('Error verifying OTP:', error);
    }
  ); 
}
}

