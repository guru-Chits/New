import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberViewComponent } from './subscriber-view.component';

describe('SubscriberViewComponent', () => {
  let component: SubscriberViewComponent;
  let fixture: ComponentFixture<SubscriberViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriberViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
