import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { SubscriberService } from '../shared/service/subscriber.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor( private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private service: SubscriberService,
    private router:Router,
  
  ) { }

filesInfo = {
  panCard: null,
  aadharCard: null,
  passbook: null,
};
subscriberDetail: any;
isSubscriberListVisible = false;
showAllSubscribers = false;
searchQuery = '';
data: any[] = [];
filteredSubscribers:any;
displayedSubscribers: any[];
selectedSubscriber: any;
referralClient :string


ngOnInit(): void {


  this.subscriberForm = this.fb.group({
    subscriberId: [{ value: '', disabled: true },],
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/)]],
    aliasName: ['', [Validators.pattern(/^[A-Z][a-zA-Z\/\-() ]+$/)]],
    contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    place: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    gender: ['', Validators.required],
    dob: ['', [this.ageValidator(18)]],
    occupation: ['', [Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    routeId: ['',[Validators.required]],
    accountNumber: ['', [Validators.pattern(/^\d{8,12}$/)]],
    ifsc: ['', [Validators.pattern(/^[A-Za-z]{4}\d{7}$/)]],
    upi_id: [''],
    panCardNumber: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    aadharNumber: ['', [ Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/)]],
    bankName: ['', [ Validators.pattern(/^[a-zA-Z\s]+$/)]],
    referralClient: [''],
    nomineeName: ['', [ Validators.pattern(/^[A-Z][a-zA-Z]+$/)]],
    nomineeRelation: [''],
    nomineeAddress: ['', [ Validators.minLength(10), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    nomineeOccupation: ['', [ Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    nomineeGender: ['',],
    nomineeAadhar: ['', [ Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/)]],
    nomineeDOB: ['', [  this.ageValidator(18)]],
    profileImage: [''],
    aadhar:[''],
    passbook:[''],
    pan: [''],
  });


  // Load data, initialize form, etc.
  this.activatedRoute.params.subscribe(paramData => {
    console.log("ObjectKeys =>",Object.keys(paramData))
    console.log("ParamData =>", paramData)
    if (Object.keys(paramData).length) {
    this.service.getsubscriberById(paramData.id).subscribe((data) => {
      this.subscriberData = data;
      this.subscriberId=this.subscriberData.Subscriber._id
      this.profileImageUrl=this.subscriberData.Subscriber.profileImageUrl
      console.log(this.profileImageUrl);
      

      this.subscriber=false
      console.log('Project Data = >',this.subscriberData)
      const updatedSubscriber = { ...this.subscriberData.Subscriber };

      this.subscriberForm.patchValue(updatedSubscriber);
      console.log("form", this.subscriberForm);
    })
  }
  })

  this.service.getsubscriberAll().subscribe((data)=>{
    this.subscriberData=data;
    this.subscriberIdCounter=this.subscriberData.AllSubscriber.length+10000
    console.log(this.subscriberIdCounter);
    this.setSubscriberId(this.subscriberIdCounter);
    this.subscriberForm.get('firstName')?.valueChanges.subscribe(value => {
      this.autoCorrectNames();
    
    });

    console.log("subscriber data",this.subscriberData);
   
    this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
      id:subscriberDetails?._id,
      subscriberId: subscriberDetails?.subscriberId,
      subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
      subscriberProfile:subscriberDetails?.profileImageUrl
    }))
    this.displayedSubscribers = this.data;
  })


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
  return `https://via.placeholder.com/150/000000/FFFFFF/?text=${initial}`;
}

onSubmit(): void {
    const formData = new FormData();
    const formValue = this.subscriberForm.getRawValue();

    if (!formValue.profileImage) {
      formValue.profileImage = this.generateDefaultProfileImage(formValue.firstName);
    }

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        formData.append(key, formValue[key]);
      }
    }

    this.service.savesubscriberDetails(formData, this.subscriberId).subscribe((data) => {
      console.log(data);
      this.router.navigate(["/subscriber"]);
    });
  }

applyFilter(filterValue: string) {
  if (!filterValue || !this.data) {
    this.displayedSubscribers = this.data; // Show all if there's no filter or data is not defined
    return;
  }

  this.displayedSubscribers = this.data.filter(subscriber => {
    const subscriberId = subscriber.subscriberId ? subscriber.subscriberId.toString().toLowerCase() : '';
    const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
    return subscriberId.includes(filterValue.toLowerCase()) || subscriberName.includes(filterValue.toLowerCase());
  });
}



onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result;
      this.subscriberForm.patchValue({ profileImage: file });
    };
    reader.readAsDataURL(file);
  }
}


onFileChange(event: any, controlName: string): void {
  if (event.target.files && event.target.files.length) {
    const file = event.target.files[0];
    this.subscriberForm.patchValue({
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

addReferral(): void {
  if (this.subscriberDetail) {
    this.referralClient = this.subscriberDetail.Subscriber.firstName;
    console.log(this.referralClient);
    
    this.isSubscriberListVisible = false;
  }
}


}
