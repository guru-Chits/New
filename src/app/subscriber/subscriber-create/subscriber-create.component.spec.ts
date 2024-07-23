import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberCreateComponent } from './subscriber-create.component';

describe('SubscriberCreateComponent', () => {
  let component: SubscriberCreateComponent;
  let fixture: ComponentFixture<SubscriberCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriberCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriberCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
