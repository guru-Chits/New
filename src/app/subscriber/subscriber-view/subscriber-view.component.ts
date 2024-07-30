import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriber-view',
  templateUrl: './subscriber-view.component.html',
  styleUrl: './subscriber-view.component.css'
})
export class SubscriberViewComponent {
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  subscribers = [
    { id: 'KNG-C10001', firstName: 'John', lastName: 'Doe', alias: 'Entrans', contact: '970543210', address: 'JP Nagar', occupation: 'Engineer', referredBy: 'Shiva', enrollments: 2 },
    { id: 'KNG-C10002', firstName: 'Jane', lastName: 'Smith', alias: 'Techie', contact: '970543211', address: 'MG Road', occupation: 'Doctor', referredBy: 'Krishna', enrollments: 1 },
    { id: 'KNG-C10002', firstName: 'Jane', lastName: 'Smith', alias: 'Techie', contact: '970543211', address: 'MG Road', occupation: 'Doctor', referredBy: 'Krishna', enrollments: 1 },
  ];
  filteredSubscribers = [...this.subscribers];
  isShowDiv = false;  


  toggleDisplayDiv() {  
    this.isShowDiv = !this.isShowDiv;  
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
  applyFilter(filterValue: string) {
    this.filteredSubscribers = this.subscribers.filter(subscriber =>
      subscriber.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
      subscriber.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
      subscriber.id.toLowerCase().includes(filterValue.toLowerCase())
    );
  }
}
