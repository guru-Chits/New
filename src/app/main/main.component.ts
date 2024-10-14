import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  isSidebarVisible: boolean = true;

  // Toggle method to show or hide sidebar
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
