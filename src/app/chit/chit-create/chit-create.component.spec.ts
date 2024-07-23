import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitCreateComponent } from './chit-create.component';

describe('ChitCreateComponent', () => {
  let component: ChitCreateComponent;
  let fixture: ComponentFixture<ChitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChitCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChitCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
