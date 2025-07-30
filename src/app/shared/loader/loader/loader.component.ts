// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../service/loader/loader.service';
@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-backdrop" *ngIf="isLoading | async">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  isLoading = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService) {}
}
