import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionSidebarComponent } from './auction-sidebar.component';

describe('AuctionSidebarComponent', () => {
  let component: AuctionSidebarComponent;
  let fixture: ComponentFixture<AuctionSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuctionSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
