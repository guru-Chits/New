import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ChitService } from '../shared/service/chit.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-auction-sidebar',
  templateUrl: './auction-sidebar.component.html',
  styleUrl: './auction-sidebar.component.css'
})
export class AuctionSidebarComponent {
  auctions: any
  chitdata: any;
  displayedAuctions: any
  showGroups: boolean = false
  constructor(private service: ChitService, private router: Router) { }
  ngOnInit() {
    this.service.getAuctionToday().subscribe((data => {
      this.auctions = data
      this.auctions = this.auctions.todaysAuction
      this.displayedAuctions = this.auctions.slice(0, 5)
    }))
  }
  applyFilter(filterValue: string) {
    this.displayedAuctions = this.auctions;
    if (!filterValue || !this.auctions) {
      return;
    }

    this.displayedAuctions = this.auctions.filter(subscriber => {
      const chitGroupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
      return chitGroupId.includes(filterValue.toLowerCase());
    });
  }
  nav(id: string) {
    this.router.navigate([`chit/auction/${id}`])
  }

  viewAll() {
    if (!this.showGroups) {
      this.displayedAuctions = this.auctions; // Show all subscribers
      this.showGroups = true;
    }

  }
  viewLess() {
    if (this.showGroups) {
      this.displayedAuctions = this.auctions.slice(0, 5);
      this.showGroups = false;
    }

  }
}
