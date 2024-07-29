import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriber-view',
  templateUrl: './subscriber-view.component.html',
  styleUrl: './subscriber-view.component.css'
})
export class SubscriberViewComponent {
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image

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
