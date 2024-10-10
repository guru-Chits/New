import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../area/shared/service/area.service';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrl: './staff-create.component.css',
  providers: [DatePipe]
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
    private routeService:AreaService,
    private HttpClient:HttpClient,
    private datePipe: DatePipe
  
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
 workingStatus:boolean=false
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
    contact: ["+91 ", [Validators.required, Validators.pattern(/^\+91\s?\d{10}$/)]],
    address: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    emailId:["", [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(100)]],
    dob: ['', [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('dob')?.value, this.ageValidator(18)),
    ]],
    routeId: [[], [Validators.required]],
    accountNumber: ["", [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('accountNumber')?.value, Validators.pattern(/^\d{8,12}$/))
    ]],
    ifscCode: ['', [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('ifscCode')?.value, Validators.pattern(/^[A-Za-z]{4}\d{7}$/))
    ]],
    upiIdOrNumber: ["",[Validators.required,this.conditionalValidator(() => !!this.staffsForm?.get('upiIdOrNumber')?.value, Validators.pattern(/^[\w.-]+@[\w.-]+$/))
    ]],
    panCardNumber: ['', [
      this.conditionalValidator(() => !!this.staffsForm?.get('panCardNumber')?.value, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/))
    ]],
    panUrl: [""],
    aadharNumber: [, [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('aadharNumber')?.value, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/))
    ]],
    aadharUrl: ["",[Validators.required]],
    drivingLicenseUrl: [""],
    drivingLicenseNumber: ["", this.conditionalValidator(() => !!this.staffsForm?.get('drivingLicenseNumber')?.value, Validators.pattern(/^[A-Z]{2}[- ]?[A-Z0-9]{2}[ ]?[0-9]{4}[ ]?[0-9]{7}$/))],
    bankName: ["",[Validators.required]],
    passbookUrl: [""],
    workingStatus: ["", [Validators.required]],
    bgVerification: ["UnVerified"],
    bgVerification_remark: [""],
    profileUrl:[""],
    password:["Staff@578"]
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
        if (this.staffData.Staff.workingStatus) {
          this.workingStatus=true
          
        } else {
          this.workingStatus=false
        }

        const utcDob = this.convertDateFormat(this.staffData.Staff.dob);

         const updatedStaff = { ...this.staffData.Staff,dob:utcDob};
         
         this.staffsForm.patchValue(updatedStaff);
      })
    }
    })
    this.service.getstaffAll().subscribe((data)=>{
      this.staffData=data;
      if(!this.staffId){
        this.staffIdCounter+=this.staffData.AllStaff.length+1;
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
  allowValidInput(event: any, pattern: RegExp): void {
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  // Use this method on form inputs
  onFirstNameKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event, /^[A-Za-z]+$/); // Only letters allowed
  }
  onAccNoKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event,/^[0-9]+$/); // Only letters allowed
  }
  
  onIfscKeyPress(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;
  
    // Allow only letters (A-Z, a-z) for the first 4 characters
    if (input.length < 4) {
      if (!/[a-zA-Z]/.test(event.key)) {
        event.preventDefault(); // Prevent invalid input for first 4 characters
      } 
    }
  
    // Allow only digits for characters from 5 to 11
    if (input.length >= 4 && input.length < 11 && !/\d/.test(event.key)) {
      event.preventDefault(); // Prevent invalid input for digits
    }
  
    // Prevent input if length exceeds 11 characters
    if (input.length >= 11) {
      event.preventDefault();
    }
  }

  onPanCardKeyPress(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;
  
    // Allow only letters (A-Z, a-z) for the first 5 characters
    if (input.length < 5) {
      if (!/[a-zA-Z]/.test(event.key)) {
        event.preventDefault(); // Prevent invalid input for the first 5 characters
      } 
    }
  
    // Allow only digits for the 6th to 9th characters
    if (input.length >= 5 && input.length < 9 && !/\d/.test(event.key)) {
      event.preventDefault(); // Prevent invalid input for the digits part
    }
  
    // Allow only a letter (A-Z) for the 10th character
    if (input.length === 9) {
      if (!/[a-zA-Z]/.test(event.key)) {
        event.preventDefault(); // Prevent invalid input for the last letter
      }
    }
  
    // Prevent input if length exceeds 10 characters
    if (input.length >= 10) {
      event.preventDefault();
    }
  }
  onDrivingLicenseKeyPress(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value;
  
    // Define the allowed characters for different positions
    if (input.length < 2) {
      // Allow only letters for the first two characters
      if (!/[A-Z]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length === 2) {
      // Allow a hyphen, space, or alphanumeric character after the first 2 letters
      if (!/[- ]|[A-Z0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length > 2 && input.length <= 4) {
      // Allow alphanumeric for the next 2 characters
      if (!/[A-Z0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length === 5) {
      // Allow space after the first 4 characters
      if (!/[ ]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length >= 6 && input.length <= 9) {
      // Allow only digits for the next 4 characters
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length === 10) {
      // Allow space after the 4 digits
      if (!/[ ]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length >= 11 && input.length < 18) {
      // Allow only digits for the last 7 characters
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }
  
    // Prevent input if length exceeds 18 characters
    if (input.length >= 18) {
      event.preventDefault();
    }
  }
  onDrivingLicenseInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;
  
    // Automatically convert lowercase to uppercase
    inputElement.value = input.toUpperCase();
  
    // Manually handle spaces, dashes, and number/letter limitations
    const regexPattern = /^[A-Z]{0,2}[- ]?[A-Z0-9]{0,2}[ ]?[0-9]{0,4}[ ]?[0-9]{0,7}$/;
  
    // Check if the current input matches the allowed format
    if (!regexPattern.test(inputElement.value)) {
      // Revert to the previous valid value if the input doesn't match the allowed format
      inputElement.value = inputElement.value.slice(0, -1);
    }
  }
  
  onIFSCAutoUppercase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    
    // Convert all letters to uppercase
    let currentValue = inputElement.value.toUpperCase();
  
    // Allow only 4 uppercase letters and 7 digits
    currentValue = currentValue.replace(/[^A-Z\d]/g, ''); // Remove any invalid characters
  
    // Update the input value with the processed string
    inputElement.value = currentValue;
  
    // Restrict the length to a maximum of 11 characters (4 letters + 7 digits)
  
  }
  formatAadharNumber(): void {
    let aadhar = this.staffsForm.get('aadharNumber')?.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (aadhar.length > 4) {
      aadhar = aadhar.substring(0, 4) + ' ' + aadhar.substring(4);
    }
    if (aadhar.length > 9) {
      aadhar = aadhar.substring(0, 9) + ' ' + aadhar.substring(9);
    }
    this.staffsForm.patchValue({
      aadharNumber: aadhar
    }, { emitEvent: false });
  }
  
  onlyAllowNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Prevent non-numeric characters
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  onContactChange(event: any) {
    let inputValue = event.target.value;

    // Remove all non-numeric characters except the prefix
    let numbersOnly = inputValue.replace(/[^\d]/g, '');

    // Ensure the value starts with +91 and limit the length to 10 digits after the prefix
    if (numbersOnly.startsWith('91')) {
      numbersOnly = '+91 ' + numbersOnly.substring(2, 12); // Take only 10 digits after +91
    } else {
      numbersOnly = '+91 ';
    }

    // Patch the value back to the form control
    this.staffsForm.patchValue({
      contact: numbersOnly
    });
  }
  blockPrefix(event: any) {
    const inputValue = this.staffsForm.get('contact')?.value;

    // Prevent deletion or modification of the '+91 ' prefix
    if (event.target.selectionStart < 4 && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
  working(event:any){
   this.workingStatus= this.staffsForm.get('workingStatus')?.value;
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
  onDateChange(event: any) {
    // Manually parsing the date and formatting it to dd-MM-yyyy
    const formattedDate = this.datePipe.transform(event, 'dd-MM-yyyy');
    this.staffsForm.get('dob').setValue(formattedDate, { emitEvent: false });
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
  
  // this.staffsForm.patchValue({
  //   password: this.generateRandomPassword(12)  // Generate a 12-character random password
  // });
  
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
    if (!this.staffId) {  
      const mobile = this.staffsForm.get('contact')?.value;
      const password = (this.staffsForm.get('password')?.value); // URL encode
      const loginLink = ('http://13.127.210.25/login'); // URL encode
      const empId = (this.staffsForm.get('employeeId')?.value); // URL encode
      
      const otpUrl = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=b1037ef1-2ed8-11ef-8b60-0200cd936042&to=${mobile}&from=KNGCPL&templatename=Onboarding&var1=${loginLink}&var2=${empId}&var3=${password}`;
  
      // Send OTP
      this.HttpClient.get(otpUrl).subscribe(
        (otpResponse: any) => {
          console.log('OTP sent successfully:', otpResponse);
        },
        (error) => {
          console.error('Error sending OTP:', error);
        }
      );
    }
  
    this.router.navigate(['/staff']);
  });
  

}


}

