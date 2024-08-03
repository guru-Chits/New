import { Component } from '@angular/core';

@Component({
  selector: 'app-auction-sidebar',
  templateUrl: './auction-sidebar.component.html',
  styleUrl: './auction-sidebar.component.css'
})
export class AuctionSidebarComponent {
  auction = [
    {id:'GC-JAN24-IX-100',time:'10:00 am'},
    {id:'GC-JAN24-IX-100',time:'10:00 am'},
    {id:'GC-JAN24-IX-100',time:'10:00 am'},
    {id:'GC-JAN24-IX-100',time:'10:00 am'},
    {id:'GC-JAN24-IX-100',time:'10:00 am'},
    {id:'GC-JAN24-IX-100',time:'10:00 am'},

  ];
  filteredAuction = [...this.auction];


}
