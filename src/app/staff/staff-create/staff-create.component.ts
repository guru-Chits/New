import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
export class StaffCreateComponent implements OnInit {
  staffsForm: FormGroup;
  heading: string = "Create Staff"
  submit: string = "Submit"
  aadharUrl: string | null = null
  profileUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg';
  get employeeIdControl() { return this.staffsForm.get('employeeId'); };
  routeData: any
  panFile:string
  licenceFile:string
  aadharFile:string
  passbookFile:string
  uploaded:any
  routes: Array<{ routeId: string }> = [];
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: StaffService,
    private router: Router,
    private routeService: AreaService,
    private HttpClient: HttpClient,
    private datePipe: DatePipe

  ) { }
  routeId: []
  breadcrumsData: any = [
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
    drivingLicenceUrl: null
  };
  data: any[] = [];
  staffData: any = {}
  staffId: string
  staff: any = true
  private staffIdPrefix: string = 'KNG-';
  staffIdCounter: string = 'E00'
  displayedStaffs: any[];
  workingStatus: boolean = false
  inputText = '';
  role: boolean = false
  url
  urls: any

  ngOnInit() {
    let role = localStorage.getItem('userRole')
    role = role ? role.replace(/"/g, '') : null; // Clean up role string
    if (role == "SuperAdmin") {
      this.role = true
    } else {
      this.role = false
    }
    this.staffsForm = this.fb.group({
      employeeId: [{ value: '', disabled: true },],
      firstName: ["", [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/), Validators.maxLength(25), Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.pattern(/^[A-Z][a-z ]*$/), Validators.maxLength(25), Validators.minLength(1)]],
      gender: ["", [Validators.required]],
      role: ["", [Validators.required]],
      contact: ["", [Validators.required]],
      address: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
      emailId: ["", [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(100)]],
      dob: ['', [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('dob')?.value, this.ageValidator(18)),
      ]],
      routeId: [[], [Validators.required]],
      accountNumber: ["", [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('accountNumber')?.value, Validators.pattern(/^\d{8,16}$/))
      ]],
      ifscCode: ['', [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('ifscCode')?.value, Validators.pattern(/^[A-Za-z]{4}\d{7}$/))
      ]],
      upiIdOrNumber: ["", [Validators.required,
      ]],
      panCardNumber: ['', [
        this.conditionalValidator(() => !!this.staffsForm?.get('panCardNumber')?.value, Validators.pattern(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/))
      ]],
      panUrl: [""],
      aadharNumber: [, [Validators.required,
      this.conditionalValidator(() => !!this.staffsForm?.get('aadharNumber')?.value, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/))
      ]],
      aadharUrl: [""],
      drivingLicenceUrl: [""],
      drivingLicenseNumber: ["", this.conditionalValidator(() => !!this.staffsForm?.get('drivingLicenseNumber')?.value, Validators.pattern(/^[A-Z]{2}[- ]?[A-Z0-9]{2}[ ]?[0-9]{4}[ ]?[0-9]{7}$/))],
      bankName: ["", [Validators.required]],
      passbookUrl: [""],
      workingStatus: ["", [Validators.required]],
      bgVerification: ["UnVerified"],
      bgVerification_remark: [""],
      profileUrl: [""],
      password: [""]
    });
      
    
    this.activatedRoute.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
        this.breadcrumsData = [
          {
            key: 'Staff Management',
            routerLink: 'staff',
          },
          {
            key: 'Edit Staff',
            routerLink: `edit/${paramData._id}`,
          },];

        this.heading = "Edit Staff Details"
        this.submit = "Save Changes"
        
        this.service.getstaffById(paramData.id).subscribe((data) => {
          this.staffData = data;
          this.staffId = this.staffData.Staff._id
          this.profileUrl = this.staffData.Staff.profileUrl
          this.panFile=this.staffData.Staff.panUrl
          this.licenceFile=this.staffData.Staff.drivingLicenceUrl
          this.aadharFile=this.staffData.Staff.aadharUrl
          this.passbookFile=this.staffData.Staff.passbookUrl
          this.urls = this.staffData.Staff

          const formData = new FormData();
          formData.append('panUrl',  this.staffData.Staff.panUrl);          
          if (this.staffId) {    
            const existingPassword=this.staffData?.Staff?.password
            this.staffsForm.get('password')?.setValue(existingPassword)
          }
          this.aadharUrl = this.staffData.Staff.aadharUrl
          this.staff = false
          if (this.staffData.Staff.workingStatus) {
            this.workingStatus = true

          } else {
            this.workingStatus = false
          }

          const utcDob = this.convertDateFormat(this.staffData.Staff.dob);

          const updatedStaff = { ...this.staffData.Staff, dob: utcDob };
          this.staffsForm.patchValue(updatedStaff);
        })
      }else{
        const tempPassword="Staff@578"
        this.staffsForm.get('password')?.setValue(tempPassword)
  
      }
    })
    this.service.getstaffAll().subscribe((data) => {
      this.staffData = data;
      if (!this.staffId) {
        this.staffIdCounter += this.staffData.AllStaff.length + 1;
        this.setStaffId(this.staffIdCounter);
      }


      this.staffsForm.get('firstName')?.valueChanges.subscribe(value => {
        this.autoCorrectNames();
      }
      );

      this.data = this.staffData.AllStaff.map((staffDetails, index) => ({
        id: staffDetails?._id,
        staffId: staffDetails?.staffId,
        staffrName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
        staffProfile: staffDetails?.profileUrl
      }))
    })
    this.routeService.getrouteAll().subscribe((data) => {
      this.routeData = data;
      this.routes = this.routeData.AllRoute.map((routeDetails, index) => ({
        routeId: routeDetails?.routeId,
      }))
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
    this.allowValidInput(event, /^[A-Za-z]+$/);
  }
  onbankNameKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event, /^[a-zA-Z ]*$/); // Only letters allowed
  }   // Only letters allowed
  onLastNameKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event,/^[a-zA-Z ]*$/); // Only letters allowed
  }   // Only letters allowed

  onAccNoKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event, /^[0-9]+$/);
  }

  onIfscKeyPress(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;

    if (input.length < 4) {
      if (!/[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
      }
    }

    if (input.length >= 4 && input.length < 11 && !/\d/.test(event.key)) {
      event.preventDefault();
    }

    if (input.length >= 11) {
      event.preventDefault();
    }
  }

  onPanCardKeyPress(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;

    if (input.length < 5) {
      if (!/[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
      }
    }

    if (input.length >= 5 && input.length < 9 && !/\d/.test(event.key)) {
      event.preventDefault();
    }
    if (input.length === 9) {
      if (!/[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
      }
    }

    if (input.length >= 10) {
      event.preventDefault();
    }
  }

  onPanCardInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;
  
    if (input.length > 0) {
      // Ensure the last character is uppercase
      const updatedInput =
        input.slice(0, input.length - 1) + input.charAt(input.length - 1).toUpperCase();
  
      // Update the input value
      inputElement.value = updatedInput;
  
      // Update the form control value explicitly
      const control = this.staffsForm.get('panCardNumber');
      if (control) {
        control.setValue(updatedInput, { emitEvent: false }); // Update form control value
      }
    }
  }
  
  onDrivingLicenseKeyPress(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value;

    if (input.length < 2) {
      if (!/[A-Z]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length === 2) {
      if (!/[- ]|[A-Z0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length > 2 && input.length <= 4) {
      if (!/[A-Z0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length === 5) {
      if (!/[ ]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length >= 6 && input.length <= 9) {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length === 10) {
      if (!/[ ]/.test(event.key)) {
        event.preventDefault();
      }
    } else if (input.length >= 11 && input.length < 18) {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }

    if (input.length >= 18) {
      event.preventDefault();
    }
  }
  onDrivingLicenseInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;
    inputElement.value = input.toUpperCase();
    const regexPattern = /^[A-Z]{0,2}[- ]?[A-Z0-9]{0,2}[ ]?[0-9]{0,4}[ ]?[0-9]{0,7}$/;
    if (!regexPattern.test(inputElement.value)) {
      inputElement.value = inputElement.value.slice(0, -1);
    }
  }

  onIFSCAutoUppercase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let currentValue = inputElement.value.toUpperCase();
    currentValue = currentValue.replace(/[^A-Z\d]/g, '');
    inputElement.value = currentValue;
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

    let numbersOnly = inputValue.replace(/[^\d]/g, '');

    // if (numbersOnly.startsWith('91')) {
    //   numbersOnly = '+91 ' + numbersOnly.substring(2, 12); // Take only 10 digits after +91
    // } else {
    //   numbersOnly = '+91 ';
    // }

    this.staffsForm.patchValue({
      contact: numbersOnly
    });
  }
  blockPrefix(event: any) {
    const inputValue = this.staffsForm.get('contact')?.value;

    if (event.target.selectionStart < 4 && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
  working(event: any) {
    this.workingStatus = this.staffsForm.get('workingStatus')?.value;
  }

  onInputChange(event: any, placeholder: string) {
    const typedText = event.target.value;
    this.inputText = typedText;
    placeholder = placeholder.slice(typedText.length);
  }

  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
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

  onProfileSelected(event: any, controlName: string): void {
    const file = event.target.files[0];
    this.filesInfo[controlName] = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          this.uploaded = e.target.result; // Set the preview URL
        
      };
      reader.readAsDataURL(file);

      // Update form value (optional for backend submission)
      this.staffsForm.patchValue({
        [controlName]: file,
      });
    }

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.staffsForm.patchValue({
        [controlName]: file
      });
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
    this.url = fileType
    let file=this.filesInfo[fileType]
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }else{
    if (this.url === "panUrl") { file = this.urls.panUrl }
    else if (this.url === "aadharUrl") { file = this.urls.aadharUrl }
    else if (this.url == 'passbookUrl') { file = this.urls.passbookUrl }
    else if (this.url == 'drivingLicenceUrl') { file = this.urls.drivingLicenceUrl }

    if (file) {
      if (typeof file === 'string') {
        window.open(file, '_blank');
      } else if (file instanceof File) {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      }
    } else {
    }
  }
  }

  // viewFile(fileType: string): void {
  //   let file = this.filesInfo[fileType];
  //   let url = fileType

  //   if (file) {
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL, '_blank');
  //   }else{      
  //     if(url=="panUrl"){ 
  //       file=this.staffData?.Staff?.panUrl       
  //       if (file) {
  //         window.open(file, '_blank');
  //       }
  //     }else if(url=="aadharUrl"){
  //       file=this.staffData?.Staff?.aadharUrl
  //       if(file){
  //         window.open(file, '_blank');
  //       }
  //     }else if(url=="passbookUrl"){
  //       file=this.staffData?.Staff?.passbookUrl
  //       if (file) {
  //         window.open(file, '_blank');
  //       }
  //     }else if(url=="drivingLicenceUrl"){
  //       file=this.staffData?.Staff?.drivingLicenceUrl
  //       if (file) {
  //         window.open(file, '_blank');
  //       }else{

  //       }
  //     }
  //     else{
  //       file=null
  //     }
  //   }
  // }

  removeFile(fileType: string): void {
    this.filesInfo[fileType] = null;
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

  setStaffId(id: string): void {
    const newStaffId = this.generateStaffId(id);
    this.staffsForm.get('employeeId')?.setValue(newStaffId);
  }
  generateStaffId(id: string): string {

    return `${this.staffIdPrefix}${id}`;
  }
  private generateDefaultProfileImage(firstName: string): string {
    const initial = firstName.charAt(0).toUpperCase();
    const color = this.getColorForInitial(initial);
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

  onSubmit(): void {
    const formData = new FormData();

    const formValue = this.staffsForm.getRawValue();    

    if (!formValue.profileUrl) {
      const defaultProfileImage = "";
      formData.append('profileUrl', defaultProfileImage);
    } else {
      const profileImageFile = this.staffsForm.get('profileUrl')?.value;
      if (profileImageFile instanceof File) {
        formData.append('profileUrl', profileImageFile);
      }
    }

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key !== 'profileUrl') {
        formData.append(key, formValue[key]);
      }
    }


    this.service.savestaffDetails(formData, this.staffId).subscribe((data) => {
      if (!this.staffId) {

        const mobile = this.staffsForm.get('contact')?.value;
        const password = "Staff@578"
        const loginLink = 'app.guruchits.com';
        const empId = this.staffsForm.get('employeeId')?.value

        const otpUrl = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=b1037ef1-2ed8-11ef-8b60-0200cd936042&to=${mobile}&from=KNGCPL&templatename=Onboarding&var1=${loginLink}&var2=${empId}&var3=${password}`;

        this.HttpClient.get(otpUrl).subscribe(
          (otpResponse: any) => {
          },
          (error) => {
          }
        );
      }

      this.router.navigate(['/staff']);
    });


  } 
  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }


}

