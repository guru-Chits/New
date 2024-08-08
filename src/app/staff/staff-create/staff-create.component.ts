import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrl: './staff-create.component.css'
})
export class StaffCreateComponent implements OnInit{
  staffsForm: FormGroup;
  heading:string="Staff Details"

  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  get employeeIdControl() { return this.staffsForm.get('employeeId'); };
  constructor( private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private service: StaffService,
    private router:Router,
  
  ) { }
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
  panCard: null,
  aadharCard: null,
  passbook: null,
  drivingLicense: null
};
data: any[] = [];
staffData:any={}
subscriberId:string
subscriber:any=true
private staffIdPrefix: string = 'KNG-C';
 staffIdCounter: string;


ngOnInit(){
    this.staffsForm = this.fb.group({
      employeeId: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      role: ["", [Validators.required]],
      contactNumber: ["", [Validators.required]],
      place: ["", [Validators.required]],
      mail:["",Validators.required],
      dob: ["", [Validators.required]],
      routeId: ["", [Validators.required]],
      accountNumber: ["", [Validators.required]],
      ifsc: ["", [Validators.required]],
      upi: ["", [Validators.required]],
      panNo: ["", [Validators.required]],
      panCard: ["", [Validators.required]],
      aadharCardNo: ["", [Validators.required]],
      aadharCard: ["", [Validators.required]],
      drivingLicense: ["", [Validators.required]],
      drivingNo: ["", [Validators.required]],
      bankName: ["", [Validators.required]],
      passbook: ["", [Validators.required]],
      workingStatus: [false, [Validators.required]],
      bgVerify: ["", [Validators.required]],
      bVRemarks: ["", [Validators.required]],

    });
    this.activatedRoute.params.subscribe(paramData => {
      console.log("ObjectKeys =>",Object.keys(paramData))
      console.log("ParamData =>", paramData)
      if (Object.keys(paramData).length) {
        this.breadcrumsData  = [
          {
            key: 'Subscriber Management',
            routerLink: 'subscriber',
          },
          {
            key: 'Edit Subscriber',
            routerLink: 'edit/this.subscriberId',
          },
         
        
        ];
        this.heading="Edit Staff Details"
  
      this.service.getstaffById(paramData.id).subscribe((data) => {
        this.staffData = data;
        this.subscriberId=this.staffData.Subscriber._id
        this.profileImageUrl=this.staffData.Subscriber.profileImageUrl
        console.log(this.profileImageUrl);
        this.subscriber=false
        console.log('Project Data = >',this.staffData)
        const utcDob = this.convertDateFormat(this.staffData.Staff.dob);
      
        if(utcDob)
        {
          const updatedStaff = { ...this.staffData.Staff.dob};
          this.staffsForm.patchValue(updatedStaff);
  
        }else{
          const updatedStaff = { ...this.staffData.Staff};
          this.staffsForm.patchValue(updatedStaff);
  
        }
  
        console.log("form", this.staffsForm);
      })
    }
    })

  
  }
  

  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileImageUrl = URL.createObjectURL(file);
    }
  }

  onFileSelected(event: any, fileType: string): void {
    this.filesInfo[fileType] = event.target.files[0];
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

setSubscriberId(id:string): void {
  console.log(id);
  
  const newSubscriberId = this.generateStaffId(id);
  this.staffsForm.get('subscriberId')?.setValue(newSubscriberId);
}
generateStaffId(id:string): string {
  // console.log(this.subscriberIdCounter);
  console.log(id);
  
  return `${this.staffIdPrefix}${id}`;
}
}

