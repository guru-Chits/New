import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscriber-create',
  templateUrl: './subscriber-create.component.html',
  styleUrl: './subscriber-create.component.css'
})
export class SubscriberCreateComponent implements OnInit{
subscriberForm: FormGroup;

profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
constructor(private formBuilder:FormBuilder){}
get subscriberIdControl() { return this.subscriberForm.get('subscriberId'); };

ngOnInit(){
  this.subscriberForm = this.formBuilder.group({
    subscriberId: ["", [Validators.required]],
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    aliasName: ["", [Validators.required]],
    contactNumber: ["", [Validators.required]],
    address: ["", [Validators.required]],
    gender: ["", [Validators.required]],
    dob: ["", [Validators.required]],
    occupation: ["", [Validators.required]],
    areaId: ["", [Validators.required]],
    accountNumber: ["", [Validators.required]],
    ifsc: ["", [Validators.required]],
    upi: ["", [Validators.required]],
    panNo: ["", [Validators.required]],
    panCard: ["", [Validators.required]],
    aadharNo: ["", [Validators.required]],
    aadharCard: ["", [Validators.required]],
    bankName: ["", [Validators.required]],
    passbook: ["", [Validators.required]],
    referralClient: ["", [Validators.required]],
    nomineeName: ["", [Validators.required]],
    nomieeRelation: ["", [Validators.required]],
    nomineeAddress: ["", [Validators.required]],
    nomineeOccupation: ["", [Validators.required]],
    nomineeGender: ["", [Validators.required]],
    nAadharNo: ["", [Validators.required]],
    ndob: ["", [Validators.required]],
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
}
