import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitComponent } from './chit.component';

describe('ChitComponent', () => {
  let component: ChitComponent;
  let fixture: ComponentFixture<ChitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
