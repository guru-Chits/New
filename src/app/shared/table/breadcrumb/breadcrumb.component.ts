import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  @Input() data: any;
  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() handleSameRoute: EventEmitter<void> = new EventEmitter<void>();
  constructor(private router: Router) { }
  ngOnInit(): void {
  }

  updateIfStepChanges(data: any) {
    this.handleSameRoute.emit(data);
    this.router.navigate([data.routerLink])
  }

  onClick(): void {
    this.clickEvent.emit();
  }
}
