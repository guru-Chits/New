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
referralClientName = '';


ngOnInit(): void {
  this.subscriberForm = this.fb.group({
    subscriberId: [{ value: '', disabled: this.subscriberId}, [Validators.required, Validators.minLength(2), Validators.maxLength(25),Validators.pattern(/^kng-c\d{4}$/)]],
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/)]],
    aliasName: ['', [Validators.pattern(/^[A-Z][a-zA-Z\/\-() ]+$/)]],
    contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    place: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    gender: ['', Validators.required],
    dob: ['', [Validators.required,this.ageValidator(18)]],
    occupation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    routeId: ['',[Validators.required]],
    accountNumber: ['', [Validators.required, Validators.pattern(/^\d{8,12}$/)]],
    ifsc: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{4}\d{7}$/)]],
    upi_id: [''],
    panCardNumber: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/)]],
    bankName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
    referralClient: [''],
    nomineeName: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+$/)]],
    nomineeRelation: [''],
    nomineeAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s,.'-]+$/)]],
    nomineeOccupation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    nomineeGender: ['', Validators.required],
    nomineeAadhar: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}$/)]],
    nomineeDOB: ['', [Validators.required,  this.ageValidator(18)]],
    profileImageUrl: [''],
    aadharUrl:[''],
    passbookUrl:[''],
    panUrl: [''],
    passbookNumber: ['']
  });

  // Load data, initialize form, etc.
  this.activatedRoute.params.subscribe(paramData => {
    console.log("ObjectKeys =>",Object.keys(paramData))
    console.log("ParamData =>", paramData)
    if (Object.keys(paramData).length) {
    this.service.getsubscriberById(paramData.id).subscribe((data) => {
      this.subscriberData = data;
      this.subscriberId=this.subscriberData.Subscriber._id
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

onSubmit(){
  console.log(this.subscriberForm);
  const payload = this.subscriberForm.value;
  console.log('payload', payload);
  this.service.savesubscriberDetails(payload, this.subscriberId).subscribe((data) => {
    console.log(data);
    this.router.navigate(["/view"]);
  })
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
    };
    reader.readAsDataURL(file);
  }
}


onFileChange(event: any, fileType: string) {
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

addReferral(): void {
  if (this.subscriberDetail) {
    this.referralClientName = this.subscriberDetail.Subscriber.firstName;
    console.log(this.referralClientName);
    
    this.isSubscriberListVisible = false;
  }
}


}
