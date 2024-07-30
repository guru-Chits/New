import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrl: './staff-create.component.css'
})
export class StaffCreateComponent implements OnInit{
  staffsForm: FormGroup;

  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  get employeeIdControl() { return this.staffsForm.get('employeeId'); };
 constructor(private formBuilder:FormBuilder){}

 filesInfo = {
  panCard: null,
  aadharCard: null,
  passbook: null,
  drivingLicense: null
};

ngOnInit(){
    this.staffsForm = this.formBuilder.group({
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
}

