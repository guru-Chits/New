import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitChitComponent } from './profit-chit.component';

describe('ProfitChitComponent', () => {
  let component: ProfitChitComponent;
  let fixture: ComponentFixture<ProfitChitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfitChitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfitChitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
