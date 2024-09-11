import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TknComponent } from './tkn.component';

describe('TknComponent', () => {
  let component: TknComponent;
  let fixture: ComponentFixture<TknComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TknComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TknComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
