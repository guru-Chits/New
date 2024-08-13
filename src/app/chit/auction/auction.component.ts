import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ITableColumn } from '../../shared/interface/list-table';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent {
  activeTab: string = 'regular'; // Default active tab
  auctionForm:FormGroup
  searchImg:string='assets/table/black search.svg'
  filterImg:string='assets/table/black filter.svg'
  search:boolean=true
 data:any[]=[]
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.auctionForm = this.fb.group({
      groupId: [{ value: '', disabled: true }], // Disabled (readonly)
      walletBal: [''],
      foreCommission: [''],
      winBid: [{ value: '', disabled: true }], // Disabled (readonly)
      priAm: [''],
      ticketId: [''],
      prizedSubName: [{ value: '', disabled: true }], // Disabled (readonly)
      passbookNumber: [''],
      auctionCycle: [''],
      auctionStart:['']
    });
  }
  selectTab(tabName: string) {
    this.activeTab = tabName;
    console.log(this.activeTab);
    
  }
    column: ITableColumn[] = [
    {field: 'Ticket Id', sortable: false,  filter:false,},
    {field: 'Name', sortable: false,  filter:false,},
    {field: 'Alias Name', sortable: false,  filter:false,},
    {field: 'Place', sortable: false,  filter:false,},
    {field: 'Occupation', sortable: false,  filter:false,}

  ];
}
