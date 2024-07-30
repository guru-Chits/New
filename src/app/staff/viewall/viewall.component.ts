import { Component } from '@angular/core';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrl: './viewall.component.css'
})
export class ViewallComponent {
  staffs = [
    { id: 'KNG - E001', firstName: 'John', lastName: 'Doe', alias: 'Entrans', contact: '970543210', address: 'JP Nagar', occupation: 'Engineer', referredBy: 'Shiva', enrollments: 2 },
    { id: 'KNG - E002', firstName: 'Jane', lastName: 'Smith', alias: 'Techie', contact: '970543211', address: 'MG Road', occupation: 'Doctor', referredBy: 'Krishna', enrollments: 1 },
    { id: 'KNG - E003', firstName: 'Jane', lastName: 'Smith', alias: 'Techie', contact: '970543211', address: 'MG Road', occupation: 'Doctor', referredBy: 'Krishna', enrollments: 1 },
  ];
  filteredStaffs = [...this.staffs];

}
