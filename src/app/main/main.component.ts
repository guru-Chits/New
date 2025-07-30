import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from '../shared/service/loader/loader.service';

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

   constructor(private router: Router, private loader: LoaderService) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loader.show();
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
           window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loader.hide();
        }
      });
    }
}
