import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { SubscriberService } from '../shared/service/subscriber.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../area/shared/service/area.service';

@Component({
  selector: 'app-subscriber-create',
  templateUrl: './subscriber-create.component.html',
  styleUrl: './subscriber-create.component.css'
})
export class SubscriberCreateComponent implements OnInit {
  subscriberForm: FormGroup;
  subscriberData: any = {}
  subscriberId: string
  subscriber: any = true
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  private subscriberIdPrefix: string = 'KNG-C';
  subscriberIdCounter: string;
  submit: string = "Submit"
  heading: string = "Subscriber Details"
  routeData: any
  routes: any[] = []
  url
  panFile:string
  aadharFile:string
  passbookFile:string
uploaded:any
  breadcrumsData: any = [
    {
      key: 'Subscriber Management',
      routerLink: '/subscriber',
    },
    {
      key: 'Create Subscriber',
      routerLink: '/subscriber/create',
    },
  ];
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: SubscriberService,
    private router: Router,
    private routeService: AreaService
  ) { }

  filesInfo = {
    panUrl: null,
    aadharUrl: null,
    passbookUrl: null,
  };
  selectedSubscriberId: string
  subscriberDetail: any;
  isSubscriberListVisible = false;
  showAllSubscribers = false;
  searchQuery = '';
  data: any[] = [];
  aadharUrl: string = '';
  filteredSubscribers: any;
  displayedSubscribers: any[];
  selectedSubscriber: any;
  referralClient: string;
  referralClientId: any;
  urls: any
  itemsPerPage = 10; // Subscribers per page
  showall = false; // To toggle "View More"
  ngOnInit(): void {
    this.subscriberForm = this.fb.group({
      subscriberId: [{ value: '', disabled: true }],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(25), Validators.minLength(2)]],
      lastName: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('lastName')?.value, Validators.pattern(/^[a-zA-Z ]*$/)),
        this.conditionalValidator(() => !!this.subscriberForm?.get('lastName')?.value, Validators.maxLength(25)),
        this.conditionalValidator(() => !!this.subscriberForm?.get('lastName')?.value, Validators.minLength(1))
      ]],
      aliasName: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('aliasName')?.value, Validators.pattern(/^[A-Z][a-zA-Z\/\-()&.@,' ]*$/)),
        this.conditionalValidator(() => !!this.subscriberForm?.get('aliasName')?.value, Validators.maxLength(50)),
        this.conditionalValidator(() => !!this.subscriberForm?.get('aliasName')?.value, Validators.minLength(2))
      ]],
      contact: ["", [Validators.required]],
      SecContact:["",[Validators.minLength(8), Validators.maxLength(14)]],
      
      place: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
      gender: ['', Validators.required],
      dob: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('dob')?.value, this.ageValidator(18)),
      ]],
      occupation: ['', [ Validators.required,
        this.conditionalValidator(() => !!this.subscriberForm?.get('occupation')?.value, Validators.pattern(/^[a-zA-Z\/\-()&.@,' ]*$/)),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      routeId: [''],
      accountNumber: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('accountNumber')?.value, Validators.pattern(/^\d{8,16}$/))
      ]],
      ifsc: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('ifsc')?.value, Validators.pattern(/^[A-Za-z]{4}\d{7}$/))
      ]],
      upi_id: [''],
      panCardNumber: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('panCardNumber')?.value, Validators.pattern(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/))
      ]],
      aadharNumber: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('aadharNumber')?.value, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/))
      ]],
      bankName: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('bankName')?.value, Validators.pattern(/^[a-zA-Z\s]+$/))
      ]],
      referralClient: [''],
      referralClientId: [''],
      nomineeName: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeName')?.value, Validators.pattern(/^[A-Z][a-zA-Z]+$/))
      ]],
      nomineeRelationship: [''],
      nomineeAddress: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeAddress')?.value, Validators.minLength(10)),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)
      ]],
      nomineeOccupation: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeOccupation')?.value, Validators.minLength(2)),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s-]+$/)
      ]],
      nomineeGender: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeGender')?.value, Validators.pattern(/^(Male|Female)$/))
      ]],
      nomineeAadhar: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeAadhar')?.value, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/))
      ]],
      nomineeDOB: ['', [
        this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeDOB')?.value, this.ageValidator(18))
      ]],
      profileImageUrl: [''],
      aadharUrl: [''],
      passbookUrl: [''],
      panUrl: ['']
    });

    // this.subscriberForm.patchValue({
    //   contact: '+91 '
    // });

    this.routeService.getrouteAll().subscribe((data) => {
      this.routeData = data;
      this.routes = this.routeData.AllRoute.map((routeDetails, index) => ({
        routeId: routeDetails?.routeId,
      }))
    })
    this.activatedRoute.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
        this.breadcrumsData = [
          {
            key: 'Subscriber Management',
            routerLink: '/subscriber',
          },
          {
            key: 'Edit Subscriber',
            routerLink: `subscriber/edit/${paramData.id}`,
          },


        ];
        this.heading = "Edit Subscriber Details"
        this.submit = "Save Changes"
        this.service.getsubscriberById(paramData.id).subscribe((data) => {
          this.subscriberData = data;
          
          this.subscriberForm.patchValue({
            SecContact: this.subscriberData.Subscriber.SecContact,
            nomineeRelationship: this.subscriberData.Subscriber.nomineeRelationship
          });
          this.subscriberId = this.subscriberData.Subscriber._id
          this.profileImageUrl = this.subscriberData.Subscriber.profileImageUrl
          this.panFile=this.subscriberData.Subscriber.panUrl
          this.aadharFile=this.subscriberData.Subscriber.aadharUrl
          this.passbookFile=this.subscriberData.Subscriber.passbookUrl

          this.urls = this.subscriberData.Subscriber
          this.subscriber = false
          const utcDob = this.convertDateFormat(this.subscriberData.Subscriber.dob);
          const utcnDob = this.convertDateFormat(this.subscriberData.Subscriber.nomineeDOB);
          let updatedSubscriber = { ...this.subscriberData.Subscriber };

          this.subscriberForm.patchValue(updatedSubscriber);
          
        })
      }
    })
    this.service.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      if (!this.subscriberId) {
        this.subscriberIdCounter = this.subscriberData.AllSubscriber.length + 10001
        this.setSubscriberId(this.subscriberIdCounter);
      }

      this.subscriberForm.get('firstName')?.valueChanges.subscribe(value => {
        this.autoCorrectNames();

      });
      this.subscriberForm.get('lastName')?.valueChanges.subscribe(value => {
        this.autoCorrectNames();

      });
      this.subscriberForm.get('aliasName')?.valueChanges.subscribe(value => {
        this.autoCorrectNames();
      });
      this.subscriberForm.get('nomineeName')?.valueChanges.subscribe(value => {
        this.autoCorrectNames();
      });

      this.data = this.subscriberData.AllSubscriber.map((subscriberDetails, index) => ({
        id: subscriberDetails?._id,
        subscriberId: subscriberDetails?.subscriberId,
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
        subscriberProfile: subscriberDetails?.profileImageUrl
      }))
      this.displayedSubscribers = this.data.slice(0, this.itemsPerPage);
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
    this.allowValidInput(event,/^[a-zA-Z ]*$/); // Only letters allowed
  }   // Only letters allowed

  onLastNameKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event,/^[a-zA-Z ]*$/); // Only letters allowed
  }   // Only letters allowed

  onAliasNameKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event, (/^[a-zA-Z\/\-()&.@,' ]*$/)); // Only letters allowed
  }
  
  onAccNoKeyPress(event: KeyboardEvent): void {
    this.allowValidInput(event, /^[0-9]+$/); // Only letters allowed
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


  validateDate(value: string): void {
    const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!pattern.test(value)) {
    } else {
    }
  }

  onIFSCAutoUppercase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let currentValue = inputElement.value.toUpperCase();
    currentValue = currentValue.replace(/[^A-Z\d]/g, ''); 
    inputElement.value = currentValue;
  }

  onContactChange(event: any) {
    let inputValue = event.target.value;
    let numbersOnly = inputValue.replace(/[^\d]/g, '');
    const allowedKeys = ['Backspace', 'Tab'];
    // if (
    //   !allowedKeys.includes(event.key) &&
    //   (event.key < '0' || event.key > '9')
    // ) {
    //   event.preventDefault();
    // }
  
    // if (numbersOnly.startsWith('91')) {
    //   numbersOnly = '+91 ' + numbersOnly.substring(2, 12); // Take only 10 digits after +91
    // } else {
    //   numbersOnly = '+91 ';
    // }
    this.subscriberForm.patchValue({
      contact: numbersOnly
    });
  }
  onSecContactChange(event: any) {
    let inputValue = event.target.value;
    let numbersOnly = inputValue.replace(/[^\d]/g, '');
    // if (numbersOnly.startsWith('91')) {
    //   numbersOnly = '+91 ' + numbersOnly.substring(2, 12); // Take only 10 digits after +91
    // } else {
    //   numbersOnly = '+91 ';
    // }
    this.subscriberForm.patchValue({
      SecContact: numbersOnly
    });
  }
  blockPrefix(event: any) {
    // const inputValue = this.subscriberForm.get('contact')?.value;
    if (event.target.selectionStart < 4 && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
  secblockPrefix(event: any) {
    // const inputValue = this.subscriberForm.get('contact')?.value;
    if (event.target.selectionStart < 4 && event.key !== 'Tab') {
      event.preventDefault();
    }
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
      const control = this.subscriberForm.get('panCardNumber');
      if (control) {
        control.setValue(updatedInput, { emitEvent: false }); // Update form control value
      }
    }
  }
  
  formatAadharNumber(): void {
    let aadhar = this.subscriberForm.get('aadharNumber')?.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (aadhar.length > 4) {
      aadhar = aadhar.substring(0, 4) + ' ' + aadhar.substring(4);
    }
    if (aadhar.length > 9) {
      aadhar = aadhar.substring(0, 9) + ' ' + aadhar.substring(9);
    }
    this.subscriberForm.patchValue({
      aadharNumber: aadhar
    }, { emitEvent: false });
  }
  formatNoAadharNumber(): void {
    let aadhar = this.subscriberForm.get('nomineeAadhar')?.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (aadhar.length > 4) {
      aadhar = aadhar.substring(0, 4) + ' ' + aadhar.substring(4);
    }
    if (aadhar.length > 9) {
      aadhar = aadhar.substring(0, 9) + ' ' + aadhar.substring(9);
    }
    this.subscriberForm.patchValue({
      nomineeAadhar: aadhar
    }, { emitEvent: false });
  }
  onlyAllowNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Prevent non-numeric characters
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  conditionalValidator(condition: () => boolean, validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }
  setSubscriberId(id: string): void {
    const newSubscriberId = this.generateSubscriberId(id);
    this.subscriberForm.get('subscriberId')?.setValue(newSubscriberId);
  }

  generateSubscriberId(id: string): string {
    return `${this.subscriberIdPrefix}${id}`;
  }


  private autoCorrectNames(): void {
    this.subscriberForm.get('firstName')?.valueChanges.subscribe(value => {
      this.autoCorrectName('firstName', value);
    });
    this.subscriberForm.get('lastName')?.valueChanges.subscribe(value => {
      this.autoCorrectName('lastName', value);
    });
    this.subscriberForm.get('nomineeName')?.valueChanges.subscribe(value => {
      this.autoCorrectName('nomineeName', value);
    });
    this.subscriberForm.get('aliasName')?.valueChanges.subscribe(value => {
      this.autoCorrectName('aliasName', value);
    });
  }

  private autoCorrectName(controlName: string, value: string): void {
    if (value && value.length > 0) {
      const correctedValue = value.charAt(0).toUpperCase() + value.slice(1);
      if (correctedValue !== value) {
        this.subscriberForm.get(controlName)?.setValue(correctedValue, { emitEvent: false });
      }
    }
  }
  getSubscriberById(id: string): void {
    this.service.getsubscriberById(id).subscribe(
      data => {
        this.subscriberDetail = data;
        this.selectedSubscriberId = this.subscriberDetail.Subscriber.subscriberId;
      },
      error => {
      }
    );
  }

  onButtonClick(id: string): void {
    this.getSubscriberById(id);
  }


  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dateValue = control.value;
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return null;
    }
    return { 'invalidDate': true };
  }

  // ageValidator(minAge: number): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //     const dateValue = new Date(control.value);
  //     const age = new Date().getFullYear() - dateValue.getFullYear();
  //     if (age >= minAge) {
  //       return null;
  //     }
  //     return { 'ageBelowMinimum': true };
  //   };
  // }
  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null; // Allow empty value to be handled by 'required' validator
      }
  
      const enteredDate = new Date(control.value);
      const today = new Date();
      
      // Calculate the exact age difference
      let age = today.getFullYear() - enteredDate.getFullYear();
      const monthDiff = today.getMonth() - enteredDate.getMonth();
      const dayDiff = today.getDate() - enteredDate.getDate();
  
      // Check if the birthday hasn't happened yet in the current year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
  
      return age >= minAge ? null : { ageBelowMinimum: true };
    };
  }
  
  showAll(): void {
    this.showAllSubscribers = true;
  }
  showSubscriberList(): void {
    this.isSubscriberListVisible = true;
  }
  private generateDefaultProfileImage(firstName: string): string {
    const initial = firstName.charAt(0).toUpperCase();
    const color = this.getColorForInitial(initial);
    return `https://via.placeholder.com/150/${color}/FFFFFF/?text=${initial}`;
  }

  private getColorForInitial(initial: string): string {
    // Define a color map for the alphabet
    const colors: { [key: string]: string } = {
      A: 'FF5733', B: '33FF57', C: '3357FF', D: 'F333FF', E: '33FFF3', F: 'FF33F3', G: '33F3FF',
      H: 'F3FF33', I: '5733FF', J: '33FF33', K: 'FF3333', L: '33FF99', M: '99FF33', N: 'FF9933',
      O: 'FF33AA', P: 'AA33FF', Q: '33AAFF', R: 'FF5733', S: '33FFCC', T: '33FF33', U: 'FF33CC',
      V: 'FFCC33', W: '33FF00', X: '00FF33', Y: 'FF3399', Z: '3399FF'
    };

    // Return color based on the initial letter, default to black if no match
    return colors[initial] || '000000';
  }


  onSubmit(): void {
    const formData = new FormData();
    const formValue = this.subscriberForm.getRawValue();

    // Handle profile image URL separately from the file input
    if (!formValue.profileImageUrl) {
      const defaultProfileImage = this.generateDefaultProfileImage(formValue.firstName);
      formData.append('profileImageUrl', defaultProfileImage); // Add to FormData directly
    } else {
      // Append the file if profileImageUrl contains a file
      const profileImageFile = this.subscriberForm.get('profileImageUrl')?.value;
      if (profileImageFile instanceof File) {
        formData.append('profileImageUrl', profileImageFile);
      }
    }

    // Append other form values
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key !== 'profileImageUrl') { // Exclude the file input from rawValue
        formData.append(key, formValue[key]);
      }
    }
    this.service.savesubscriberDetails(formData, this.subscriberId).subscribe((data) => {
      this.router.navigate(['/subscriber']);
    });
  }

  // onSubmit(): void {
  //   // Create an object to hold all the form data
  //   const formValue = this.subscriberForm.getRawValue();
  //   const subscriberData: any = { ...formValue };
  
  //   // Handle profile image separately
  //   const profileImageFile = this.subscriberForm.get('profileImageUrl')?.value;
  //   if (profileImageFile instanceof File) {
  //     // If the file is present, upload it first and get the URL
  //     this.service.uploadFile(profileImageFile).subscribe((uploadedUrl: string) => {
  //       // After file upload, update the object with the uploaded URL
  //       subscriberData.profileImageUrl = uploadedUrl;
  
  //       // Send the full object with the uploaded image URL
  //       this.service.savesubscriberDetails(subscriberData, this.subscriberId).subscribe(() => {
  //         this.router.navigate(['/subscriber']);
  //       });
  //     });
  //   } else {
  //     // If no file is provided, use default profile image
  //     subscriberData.profileImageUrl = this.generateDefaultProfileImage(formValue.firstName);
  
  //     // Send the object without file upload
  //     this.service.savesubscriberDetails(subscriberData, this.subscriberId).subscribe(() => {
  //       this.router.navigate(['/subscriber']);
  //     });
  //   }
  // }

  applyFilter(filterValue: string) {
    const filteredSubscribers = this.data.filter(subscriber => {
      const subscriberId = subscriber.subscriberId?.toString().toLowerCase() || '';
      const subscriberName = subscriber.subscriberName?.toLowerCase() || '';
      const email = subscriber.email?.toLowerCase() || '';
      return subscriberId.includes(filterValue.toLowerCase()) ||
        subscriberName.includes(filterValue.toLowerCase()) ||
        email.includes(filterValue.toLowerCase());
    });

    this.displayedSubscribers = filteredSubscribers.slice(0, this.itemsPerPage);
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
      this.subscriberForm.patchValue({
        [controlName]: file,
      });
    }

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.subscriberForm.patchValue({
        [controlName]: file
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result;
        this.subscriberForm.patchValue({ profileImageUrl: file });
      };
      reader.readAsDataURL(file);
    }
  }

  viewMore() {
    if (!this.showall) {
      this.displayedSubscribers = this.data; // Show all subscribers
      this.showall = true;
    }
  }

  onFileChange(event: any, controlName: string): void {
    this.filesInfo[controlName] = event.target.files[0];

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.subscriberForm.patchValue({
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

  removeFile(fileType: string): void {
    this.filesInfo[fileType] = null;
    (document.querySelector(`input[type="file"][formControlName="${fileType}"]`) as HTMLInputElement).value = '';
  }

  addReferral(): void {
    this.referralClient = this.subscriberDetail.Subscriber.firstName;
    console.log("referral subscriber Details",this.subscriberDetail.Subscriber)
    this.referralClientId = this.subscriberDetail.Subscriber._id
    this.subscriberForm.get('referralClient').setValue(this.referralClient)
    this.subscriberForm.get('referralClientId').setValue(this.referralClientId)
    this.isSubscriberListVisible = false;
  }
}
