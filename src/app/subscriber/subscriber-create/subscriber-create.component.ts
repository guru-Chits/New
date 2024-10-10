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
export class SubscriberCreateComponent implements OnInit{


subscriberForm: FormGroup;
subscriberData:any={}
subscriberId:string
subscriber:any=true
profileImageUrl: string | ArrayBuffer | null = null;
defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
private subscriberIdPrefix: string = 'KNG-C';
 subscriberIdCounter: string;
submit:string="Submit"
heading:string="Subscriber Details"
routeData:any
routes:any[]=[]
url
 breadcrumsData: any= [
  {
    key: 'Subscriber Management',
    routerLink: '/subscriber',
  },
  { 
    key: 'Create Subscriber',
    routerLink: '/subscriber/create',
  },
];
  constructor( private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private service: SubscriberService,
    private router:Router,
  private routeService:AreaService
  ) { }

filesInfo = {
  panUrl: null,
  aadharUrl: null,
  passbookUrl: null,
};
selectedSubscriberId:string
subscriberDetail: any;
isSubscriberListVisible = false;
showAllSubscribers = false;
searchQuery = '';
data: any[] = [];
filteredSubscribers:any;
displayedSubscribers: any[];
selectedSubscriber: any;
referralClient :string;
urls:any
itemsPerPage = 10; // Subscribers per page
showall = false; // To toggle "View More"
ngOnInit(): void {
  
  this.subscriberForm = this.fb.group({
    subscriberId: [{ value: '', disabled: true }],
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/),Validators.maxLength(25),Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/),Validators.maxLength(25),Validators.minLength(2)]],
    aliasName: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('aliasName')?.value, Validators.pattern(/^[A-Z][a-zA-Z\/\-() ]+$/)),
      this.conditionalValidator(() => !!this.subscriberForm?.get('aliasName')?.value, Validators.maxLength(25)),
      this.conditionalValidator(() => !!this.subscriberForm?.get('aliasName')?.value, Validators.minLength(2))


    ]],
    contact: ["+91 ", [Validators.required, Validators.pattern(/^\+91\s?\d{10}$/)]],
    place: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    gender: ['', Validators.required],
    dob: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('dob')?.value,this.ageValidator(18)),
    ]],
    occupation: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('occupation')?.value, Validators.pattern(/^[a-zA-Z\s-]+$/)),
      Validators.minLength(2),
      Validators.maxLength(50)
    ]],
    routeId: ['', Validators.required],
    accountNumber: ['', [Validators.required,
      this.conditionalValidator(() => !!this.subscriberForm?.get('accountNumber')?.value, Validators.pattern(/^\d{8,12}$/))
    ]],
    ifsc: ['', [Validators.required,
      this.conditionalValidator(() => !!this.subscriberForm?.get('ifsc')?.value, Validators.pattern(/^[A-Za-z]{4}\d{7}$/))
    ]],
    upi_id: ['',[ Validators.required,this.conditionalValidator(() => !!this.subscriberForm?.get('upi_id')?.value, Validators.pattern(/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/))
    ]],
    panCardNumber: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('panCardNumber')?.value, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/))
    ]],
    aadharNumber: ['', [Validators.required,
      this.conditionalValidator(() => !!this.subscriberForm?.get('aadharNumber')?.value, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/))
    ]],
    bankName: ['', [Validators.required,
      this.conditionalValidator(() => !!this.subscriberForm?.get('bankName')?.value, Validators.pattern(/^[a-zA-Z\s]+$/))
    ]],
    referralClient: [''],
    nomineeName: ['', [
      this.conditionalValidator(() => !!this.subscriberForm?.get('nomineeName')?.value, Validators.pattern(/^[A-Z][a-zA-Z]+$/))
    ]],
    nomineeRelation: [''],
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
    
  // this.subscriberForm.get('profileImageUrl').valueChanges.subscribe(profile=>{
    
  // })
  this.subscriberForm.patchValue({
    contact: '+91 '
  });

  this.routeService.getrouteAll().subscribe((data)=>{
    this.routeData=data;
    console.log("kk",this.routeData)
  
    this.routes=this.routeData.AllRoute.map((routeDetails,index)=>({
      routeId: routeDetails?.routeId,  
      }))
    
     })

  // Load data, initialize form, etc.
  this.activatedRoute.params.subscribe(paramData => {
    console.log("ObjectKeys =>",Object.keys(paramData))
    console.log("ParamData =>", paramData)
    if (Object.keys(paramData).length) {
      this.breadcrumsData  = [
        {
          key: 'Subscriber Management',
          routerLink: '/subscriber',
        },
        {
          key: 'Edit Subscriber',
          routerLink: `subscriber/edit/${paramData.id}`,
        },
       
      
      ];
      this.heading="Edit Subscriber Details"
      this.submit="Save Changes"
    this.service.getsubscriberById(paramData.id).subscribe((data) => {
      this.subscriberData = data;
      this.subscriberId=this.subscriberData.Subscriber._id
      this.profileImageUrl=this.subscriberData.Subscriber.profileImageUrl
      console.log(this.profileImageUrl);
      this.urls=this.subscriberData.Subscriber
      this.subscriber=false
      console.log('Project Data = >',this.subscriberData)
      const utcDob = this.convertDateFormat(this.subscriberData.Subscriber.dob);
      const utcnDob = this.convertDateFormat(this.subscriberData.Subscriber.nomineeDOB);
    console.log(utcDob,utcDob);
    
    let updatedSubscriber = { ...this.subscriberData.Subscriber };
    console.log(updatedSubscriber);
    
    // Check if either utcDob or utcnDob exists and update accordingly
    if (utcDob) {
      updatedSubscriber = { ...updatedSubscriber, dob: utcDob };
    }
    
    if (utcnDob) {
      updatedSubscriber = { ...updatedSubscriber, nomineeDOB: utcnDob };
    }
    
    if (utcnDob&&utcDob) {
      updatedSubscriber = { ...updatedSubscriber, dob: utcDob,nomineeDOB: utcnDob };
    }

    // Patch the form with the updated subscriber data
    this.subscriberForm.patchValue(updatedSubscriber);
    
      console.log("form", this.subscriberForm);
    })
  }
  })
  this.service.getsubscriberAll().subscribe((data)=>{
    this.subscriberData=data;
    if(!this.subscriberId){
      this.subscriberIdCounter=this.subscriberData.AllSubscriber.length+10001
      console.log(this.subscriberIdCounter);
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

    console.log("subscriber data",this.subscriberData);
   
    this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
      id:subscriberDetails?._id,
      subscriberId: subscriberDetails?.subscriberId,
      subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
      subscriberProfile:subscriberDetails?.profileImageUrl
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


validateDate(value: string): void {
  const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!pattern.test(value)) {
    console.error('Invalid date format. Please use dd/mm/yyyy.');
  } else {
    console.log('Valid date:', value);
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
  this.subscriberForm.patchValue({
    contact: numbersOnly
  });
}
blockPrefix(event: any) {
  const inputValue = this.subscriberForm.get('contact')?.value;

  // Prevent deletion or modification of the '+91 ' prefix
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
 setSubscriberId(id:string): void {
  console.log(id);
  
  const newSubscriberId = this.generateSubscriberId(id);
  this.subscriberForm.get('subscriberId')?.setValue(newSubscriberId);
}

 generateSubscriberId(id:string): string {
  // console.log(this.subscriberIdCounter);
  console.log(id);
  
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

      console.log(this.subscriberDetail)
    },
    error => {
      console.error('Error fetching subscriber', error);
    }
  );
}

onButtonClick(id: string): void {
  this.getSubscriberById(id);
}


dateValidator(control: AbstractControl): {[key: string]: boolean} | null {
  const dateValue = control.value;
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    return null;
  }
  return { 'invalidDate': true };
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
showAll(): void {
  this.showAllSubscribers = true;
}
showSubscriberList(): void {
  this.isSubscriberListVisible = true;
}
private generateDefaultProfileImage(firstName: string): string {
  const initial = firstName.charAt(0).toUpperCase();
  const color = this.getColorForInitial(initial);
  
  console.log(`Initial: ${initial}, Color: ${color}`);

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
    console.log(data);
    this.router.navigate(['/subscriber']);
  });
}

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
  this.url=fileType
  let file
  // console.log(this.url,'url');
  if(this.url==="panUrl")
 {  file = this.urls.panUrl}
  else if(this.url==="aadharUrl")
 { file = this.urls.aadharUrl}
else if(this.url=='passbookUrl')
 {  file = this.urls.passbookUrl}


  console.log(file,"fi");
  
   // Get file URL from form control

  if (file) {
    if (typeof file === 'string') {
      // If the file is a URL (string), open it directly
      window.open(file, '_blank');
    } else if (file instanceof File) {
      // If it's a file object, create a blob URL and open it
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  } else {
    console.log('No file found');
  }
}

removeFile(fileType: string): void {
  this.filesInfo[fileType] = null;
  // Reset the file input field
  (document.querySelector(`input[type="file"][formControlName="${fileType}"]`) as HTMLInputElement).value = '';
}

addReferral(): void {
  // if (this.subscriberDetail) {
    this.referralClient = this.subscriberDetail.Subscriber.firstName;
    console.log(this.referralClient);
    this.subscriberForm.get('referralClient').setValue(this.referralClient)

    this.isSubscriberListVisible = false;
  // }
}


}
