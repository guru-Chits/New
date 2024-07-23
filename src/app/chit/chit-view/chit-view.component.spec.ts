import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitViewComponent } from './chit-view.component';

describe('ChitViewComponent', () => {
  let component: ChitViewComponent;
  let fixture: ComponentFixture<ChitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChitViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
