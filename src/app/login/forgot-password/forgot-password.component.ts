import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../shared/serive/login.service';
import { HttpClient } from '@angular/common/http';

interface IForgotPassword {
  employeeId:FormControl<string | null>
}
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm:FormGroup<IForgotPassword>;
  empId:any
  verified:boolean=false
  role:any
  roleAccess:any
  userdata:any
  mobileNumber:number
  reset:boolean
 employeePattern:RegExp= /^KNG-E\d{3,9}$/;
  employeeId: string;
  isemployeeIdEmpty: boolean = false;
  isRegisteredemployeeId: boolean = true;
  response:any
 constructor(private router: Router, private fb: FormBuilder,private service:LoginService,private HttpClient:HttpClient){}

 get employeeIdControl() { return this.forgotPasswordForm.get('employeeId'); };
 ngOnInit(): void {
  this.reset=true
  this.forgotPasswordForm=this.fb.group({
    employeeId:['',[Validators.required, Validators.pattern(this.employeePattern)]]
  })
}

onSubmit(){

  const payload=this.forgotPasswordForm.value
  // this.service.getLoginDetail(payload.employeeId).subscribe(response => {
  //   this.response=response
  //   if (this.response.success===true) {
  //     this.empId=  this.response.employeeId;
  //     this.router.navigate([ "login/verify"]);

  //   }else{

  //   }
  // })
  this.service.getLoginDetail(payload.employeeId).subscribe(response => {
    console.log("User details fetched:", response);
    this.response=response
    this.employeeId=this.response.user.employeeId
    if (this.response.success===true) {
      this.userdata = response;
      sessionStorage.setItem('profile', JSON.stringify(this.userdata.userProfile));
      sessionStorage.setItem('name', JSON.stringify(this.userdata.userName));
      
      this.mobileNumber = this.userdata.mobileNumber;
      this.role = this.userdata.role;
      sessionStorage.setItem('userRole', JSON.stringify(this.role));

      // Check if the user has access before proceeding
     
  
          const otpUrl = `https://2factor.in/API/V1/b1037ef1-2ed8-11ef-8b60-0200cd936042/SMS/${this.mobileNumber}/AUTOGEN/OTPTemplate`;

          this.HttpClient.get(otpUrl).subscribe(
            (otpResponse: any) => {
              console.log('OTP sent successfully:', otpResponse);
              this.verified = true;
             },
            (error) => {
              console.error('Error sending OTP:', error);
            }
          );
       
    } else{
      alert("No user details found.");
    }
  }, error => {
    console.error("Error fetching login details:", error);
  });
  console.log('lodin')
}
}
