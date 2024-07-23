import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionCreateComponent } from './region-create.component';

describe('RegionCreateComponent', () => {
  let component: RegionCreateComponent;
  let fixture: ComponentFixture<RegionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegionCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
