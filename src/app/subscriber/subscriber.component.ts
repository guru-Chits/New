import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrl: './subscriber.component.css'
})
export class SubscriberComponent {

  subscribers = [
  { id: 'KING-C10001', name: 'John Doe - Entrinz', location: 'JP Nagar', occupation: 'Engineer' },
  // Add more subscribers
];


subscriber = {
  id: 'KING-C10001',
  firstName: 'John',
  lastName: 'Doe',
  contactNo: '9876543210',
  address: 'JP Nagar',
  occupation: 'Engineer',
  referralClient: 'Shiva',
  enrollments: 2,
  region: 'Coimbatore'
};
}
