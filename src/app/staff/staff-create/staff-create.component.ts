import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../area/shared/service/area.service';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective } from '@ng-select/ng-select';

@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrl: './staff-create.component.css',
})
export class StaffCreateComponent implements OnInit{
  staffsForm: FormGroup;
  heading:string="Create Staff"
  submit:string="Submit"
  aadharUrl:string|null=null
  profileUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg';
  get employeeIdControl() { return this.staffsForm.get('employeeId'); };
  routeData:any
  routes: Array<{ routeId: string }> = [];  
  constructor( private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private service: StaffService,
    private router:Router,
    private routeService:AreaService
  
  ) { }
routeId:[]
 breadcrumsData: any= [
  {
    key: 'Staff Management',
    routerLink: '/staff',
  },
  { 
    key: 'Create Staff',
    routerLink: '/staff/create',
  },
];
 filesInfo = {
  panUrl: null,
  aadharUrl: null,
  passbookUrl: null,
  drivingLicenseUrl: null
};
data: any[] = [];
staffData:any={}
staffId:string
staff:any=true
private staffIdPrefix: string = 'KNG-';
 staffIdCounter: string='E00'
 displayedStaffs: any[];

 inputText = '';
 role:boolean=false
ngOnInit(){
  let role=sessionStorage.getItem('userRole')
  role = role ? role.replace(/"/g, '') : null; // Clean up role string
  console.log(role);

  if(role=="SuperAdmin"){
    this.role=true
    
  }


  this.staffsForm = this.fb.group({
    employeeId: [{ value: '', disabled: true },],
    firstName: ["", [Validators.required,Validators.pattern(/^[A-Z][a-zA-Z]+$/),Validators.maxLength(25),Validators.minLength(2)]],
    lastName: ["", [Validators.required,Validators.pattern(/^[A-Z][a-zA-Z]+$/),Validators.maxLength(25),Validators.minLength(2)]],
    gender: ["", [Validators.required]],
    role: ["", [Validators.required]],
    contact: ["", [Validators.required, Validators.pattern(/^\+91\s?\d{10}$/)]],
    address: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    emailId:["", [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(100)]],
    dob: ['', [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('dob')?.value, this.ageValidator(18)),
    ]],
    routeId: [[], [Validators.required]],
    accountNumber: ["", [
      this.conditionalValidator(() => !!this.staffsForm?.get('accountNumber')?.value, Validators.pattern(/^\d{8,12}$/))
    ]],
    ifscCode: ['', [
      this.conditionalValidator(() => !!this.staffsForm?.get('ifscCode')?.value, Validators.pattern(/^[A-Za-z]{4}\d{7}$/))
    ]],
    upiIdOrNumber: ["",[this.conditionalValidator(() => !!this.staffsForm?.get('upiIdOrNumber')?.value, Validators.pattern(/^[\w.-]+@[\w.-]+$/))
    ]],
    panCardNumber: ['', [
      this.conditionalValidator(() => !!this.staffsForm?.get('panCardNumber')?.value, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/))
    ]],
    panUrl: [""],
    aadharNumber: ['', [
      this.conditionalValidator(() => !!this.staffsForm?.get('aadharNumber')?.value, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/))
    ]],
    aadharUrl: [""],
    drivingLicenseUrl: [""],
    drivingLicenseNumber: ["", this.conditionalValidator(() => !!this.staffsForm?.get('drivingLicenseNumber')?.value, Validators.pattern(/^[A-Z]{2}[- ]?[A-Z0-9]{2}[ ]?[0-9]{4}[ ]?[0-9]{7}$/))],
    bankName: [""],
    passbookUrl: [""],
    workingStatus: [false, [Validators.required]],
    bgVerification: ["UnVerified"],
    bgVerification_remark: [""],
    profileUrl:[""],
    password:[""]
  });

  this.staffsForm.patchValue({
    contact: '+91 '
  });
 
    this.activatedRoute.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
        this.breadcrumsData  = [
          {
            key: 'Staff Management',
            routerLink: 'staff',
          },
          {
            key: 'Edit Staff',
            routerLink: `edit/${paramData._id}`,
          },];

        this.heading="Edit Staff Details"
        this.submit="Save Changes"
      this.service.getstaffById(paramData.id).subscribe((data) => {
        this.staffData = data;
        this.staffId=this.staffData.Staff._id
        this.profileUrl=this.staffData.Staff.profileUrl

        this.aadharUrl=this.staffData.Staff.aadharUrl
        this.staff=false

        const utcDob = this.convertDateFormat(this.staffData.Staff.dob);

         const updatedStaff = { ...this.staffData.Staff,dob:utcDob};
         
         this.staffsForm.patchValue(updatedStaff);
      })
    }
    })
    this.service.getstaffAll().subscribe((data)=>{
      this.staffData=data;
      if(!this.staffId){
        this.staffIdCounter+=this.staffData.AllStaff.length;
        this.setStaffId(this.staffIdCounter);
      }
      

      this.staffsForm.get('firstName')?.valueChanges.subscribe(value => {
        this.autoCorrectNames();
      }
    );
       
      this.data=this.staffData.AllStaff.map((staffDetails,index)=>({
        id:staffDetails?._id,
        staffId: staffDetails?.staffId,
        staffrName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
        staffProfile:staffDetails?.profileUrl
      }))
    })
    this.routeService.getrouteAll().subscribe((data)=>{
      this.routeData=data;
      console.log("kk",this.routeData)
    
      this.routes=this.routeData.AllRoute.map((routeDetails,index)=>({
        routeId: routeDetails?.routeId,  
        }))
        console.log(this.routes);
        
       })
 
  }

  onInputChange(event: any,placeholder:string) {
    const typedText = event.target.value;
    this.inputText = typedText;
     placeholder = placeholder.slice(typedText.length);
  }

  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      const dateValue = new Date(control.value);
      const age = new Date().getFullYear() - dateValue.getFullYear();
      if (age >= minAge) {
        return null;
      }
      return { 'ageBelowMinimum': true };
    };
  }
  private autoCorrectNames(): void {
    this.staffsForm.get('firstName')?.valueChanges.subscribe(value => {
      this.autoCorrectName('firstName', value);
    });
    this.staffsForm.get('lastName')?.valueChanges.subscribe(value => {
      this.autoCorrectName('lastName', value);
    });
  }

  private autoCorrectName(controlName: string, value: string): void {
    if (value && value.length > 0) {
      const correctedValue = value.charAt(0).toUpperCase() + value.slice(1);
      if (correctedValue !== value) {
        this.staffsForm.get(controlName)?.setValue(correctedValue, { emitEvent: false });
        
      }
    }
  }

  generateRandomPassword(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  onFileSelected(event: any, controlName: string): void {
    this.filesInfo[controlName] = event.target.files[0];
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
        this.staffsForm.patchValue({
        [controlName]: file
      });
    }
  }

  viewFile(fileType: string): void {
    const file = this.filesInfo[fileType];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  }

  removeFile(fileType: string): void {
    this.filesInfo[fileType] = null;
    // Reset the file input field
    (document.querySelector(`input[type="file"][formControlName="${fileType}"]`) as HTMLInputElement).value = '';
  }

  convertDateFormat(dateStr: string): string {
    if (!dateStr) {
      return '';
    }
    const dateParts = dateStr.split("-");
    if (dateParts.length !== 3) {
      return '';
    }
    const [day, month, year] = dateParts;
    if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
      return '';
    }
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }
  
 conditionalValidator(condition: () => boolean, validator: ValidatorFn): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!condition()) {
      return null;
    }
    return validator(control);
  };
}

setStaffId(id:string): void {  
  const newStaffId = this.generateStaffId(id);
  this.staffsForm.get('employeeId')?.setValue(newStaffId);
}
generateStaffId(id:string): string {

  return `${this.staffIdPrefix}${id}`;
}
private generateDefaultProfileImage(firstName: string): string {
  const initial = firstName.charAt(0).toUpperCase();
  const color = this.getColorForInitial(initial);
  
  console.log(`Initial: ${initial}, Color: ${color}`);

  return `https://via.placeholder.com/150/${color}/FFFFFF/?text=${initial}`;
}

private getColorForInitial(initial: string): string {
 
  const colors: { [key: string]: string } = {
    A: 'FF5733', B: '33FF57', C: '3357FF', D: 'F333FF', E: '33FFF3', F: 'FF33F3', G: '33F3FF',
    H: 'F3FF33', I: '5733FF', J: '33FF33', K: 'FF3333', L: '33FF99', M: '99FF33', N: 'FF9933',
    O: 'FF33AA', P: 'AA33FF', Q: '33AAFF', R: 'FF5733', S: '33FFCC', T: '33FF33', U: 'FF33CC',
    V: 'FFCC33', W: '33FF00', X: '00FF33', Y: 'FF3399', Z: '3399FF'
  };

  return colors[initial] || '000000';
}


// onSubmit(): void {
//   const formData = new FormData();
  
//   this.staffsForm.patchValue({
//     password: this.generateRandomPassword(12)  // Generate a 12-character random password
//   });
  
//   const formValue = this.staffsForm.getRawValue();

//   if (!formValue.profileImageUrl) {
//     const defaultProfileImage = this.generateDefaultProfileImage(formValue.firstName);
//     formData.append('profileUrl', defaultProfileImage); // Add to FormData directly
//   } else {
//     // Append the file if profileImageUrl contains a file
//     const profileImageFile = this.staffsForm.get('profileUrl')?.value;
//     if (profileImageFile instanceof File) {
//       formData.append('profileUrl', profileImageFile);
//     }
//   }

//   // Append other form values
//   for (const key in formValue) {
//     if (formValue.hasOwnProperty(key) && key !== 'profileUrl') { // Exclude the file input from rawValue
//       formData.append(key, formValue[key]);
//     }
//   }

//   this.service.savestaffDetails(formData, this.staffId).subscribe((data) => {
//     this.router.navigate(["/staff"]);
//   });
// }

onSubmit(): void {
  const formData = new FormData();
  
  this.staffsForm.patchValue({
    password: this.generateRandomPassword(12)  // Generate a 12-character random password
  });
  
  const formValue = this.staffsForm.getRawValue();

  // Check if it's a new staff creation
  const isNewStaff = !this.staffId;  // Assuming staffId will be undefined or null for new staff

  if (!formValue.profileImageUrl) {
    const defaultProfileImage = this.generateDefaultProfileImage(formValue.firstName);
    formData.append('profileUrl', defaultProfileImage); // Add to FormData directly
  } else {
    // Append the file if profileImageUrl contains a file
    const profileImageFile = this.staffsForm.get('profileUrl')?.value;
    if (profileImageFile instanceof File) {
      formData.append('profileUrl', profileImageFile);
    }
  }

  // Append other form values
  for (const key in formValue) {
    if (formValue.hasOwnProperty(key) && key !== 'profileUrl') { // Exclude the file input from rawValue
      formData.append(key, formValue[key]);
    }
  }

  this.service.savestaffDetails(formData, this.staffId).subscribe((data) => {
    if (isNewStaff) {
      // Send notification (OTP API or Email) with employeeId, password, and link
      // const employeeId = this.staffsForm.get('employeeId')?.value;
      // const password = this.staffsForm.get('password')?.value;
      // const loginLink = 'http://13.127.210.25/login/forgot-password';
      
      // let message = `Your employee ID is ${employeeId} and your temporary password is ${password}. Use the following link to login and reset your password: ${loginLink}`;
    }
      // Assuming the service has a method to send SMS or email notifications
      this.service.sendSms(
         formValue.contact,
         `Your employee ID is ${ this.staffsForm.get('employeeId')?.value} and your temporary password is ${this.staffsForm.get('password')?.value}. Use the following link to login and reset your password: ${'http://13.127.210.25/login/forgot-password'}`,
      )
    
    // Navigate to staff list after saving
    this.router.navigate(["/staff"]);

  })

}


}

