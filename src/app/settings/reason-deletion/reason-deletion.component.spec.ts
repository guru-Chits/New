import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonDeletionComponent } from './reason-deletion.component';

describe('ReasonDeletionComponent', () => {
  let component: ReasonDeletionComponent;
  let fixture: ComponentFixture<ReasonDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReasonDeletionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReasonDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
