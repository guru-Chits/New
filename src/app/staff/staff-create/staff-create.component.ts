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
ngOnInit(){
  this.staffsForm = this.fb.group({
    employeeId: [{ value: '', disabled: true },],
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    gender: ["", [Validators.required]],
    role: ["", [Validators.required]],
    contact: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    emailId:["", [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(100)]],
    dob: ['', [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('dob')?.value, this.ageValidator(18)),
    ]],
    routeId: [[], [Validators.required]],
    accountNumber: ["", [
      this.conditionalValidator(() => !!this.staffsForm?.get('accountNumber')?.value, Validators.pattern(/^\d{8,12}$/))
    ]],
    ifscCode: [""],
    upiIdOrNumber: [""],
    panCardNumber: [""],
    panUrl: [""],
    aadharNumber: ["", [Validators.required,Validators.pattern(/^\d{12}$/)]],
    aadharUrl: [""],
    drivingLicenseUrl: [""],
    drivingLicenseNumber: ["", this.conditionalValidator(() => !!this.staffsForm?.get('drivingLicenseNumber')?.value, Validators.pattern(/^AA[0-9]{9}$/))],
    bankName: [""],
    passbookUrl: [""],
    workingStatus: ["", [Validators.required]],
    bgVerification: [""],
    bgVerification_remark: [""],
    profileUrl:[""]
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
  return `https://via.placeholder.com/150/000000/FFFFFF/?text=${initial}`;
}

onSubmit(): void {
  const formData = new FormData();
  const formValue = this.staffsForm.getRawValue();

  if (!formValue.profileUrl && !this.profileUrl) {
    formValue.profileImage = this.generateDefaultProfileImage(formValue.firstName);
    
    this.staffsForm.get('profileUrl')?.setValue(formValue.profileImage);
  }

  for (const key in formValue) {
    if (formValue.hasOwnProperty(key)) {
      formData.append(key, formValue[key]);
    }
  }

  this.service.savestaffDetails(formData, this.staffId).subscribe((data) => {
    this.router.navigate(["/staff"]);
  });
}
}

