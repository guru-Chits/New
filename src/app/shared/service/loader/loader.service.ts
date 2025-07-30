// loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loader = new BehaviorSubject<boolean>(false);
  public isLoading = this.loader.asObservable();

  show() {
    this.loader.next(true);
  }

 hide(delay: number = 300) {
    setTimeout(() => this.loader.next(false), delay); // 👈 delay before hiding
  }
}
