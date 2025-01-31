import { Component } from '@angular/core';
import { ChitService } from '../chit/shared/service/chit.service';
import { Router } from '@angular/router';
import { SubscriberService } from '../subscriber/shared/service/subscriber.service';
import { StaffService } from '../staff/shared/service/staff.service';
import { ITableColumn } from '../shared/interface/list-table';
import { CellClickedEvent, ColDef } from 'ag-grid-community';

// import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  auctions: any
  chitdata: any;
  subs_totalCount: number
  subscriberData: any
  staffData: any
  staff_totalCount: number
  chit_total: number
  displayedAuctions: any
  showGroups: boolean = false
  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Highcharts.Options = {
  //   title: { text: 'Dynamic Line Chart from API' },
  //   xAxis: { categories: [] }, // Empty initially
  //   series: [{ type: 'line', data: [], name: 'API Data' }], // Empty initially
  // };
  constructor(private chit_service: ChitService, private router: Router, private sub_service:SubscriberService, private staff_service:StaffService) { }
  ngOnInit() {
    this.chit_service.getAuctionToday().subscribe((data => {
      this.auctions = data
      this.auctions = this.auctions.todaysAuction
      this.displayedAuctions = this.auctions.slice(0, 5)
    }));
    this.sub_service.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      this.subs_totalCount = this.subscriberData.AllSubscriber.length
    });
    this.staff_service.getstaffAll().subscribe((data) => {
      this.staffData = data;
      this.staff_totalCount = this.staffData.AllStaff.length
    });
    this.chit_service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups

      this.chit_total = this.chitdata.length
    })
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

  // fetchChartData() {
  //   const apiUrl = 'https://api.example.com/monthly-amount'; // Replace with your API endpoint
  //   this.http.get<{ month: string; amount: number }[]>(apiUrl).subscribe((response) => {
  //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //     const dataMap = new Map(response.map((item) => [item.month, item.amount]));

  //     const data = months.map((month) => dataMap.get(month) || 0); // Fill missing months with 0

  //     this.chartOptions = {
  //       ...this.chartOptions,
  //       series: [{ type: 'line', data, name: 'Amount' }],
  //     };
  //   });
  // }

  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    // const subscriberId = params.data.subscriberId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="32" height="32" style="border-radius: 50%; ">
      </div>
    `;
  }

  column: ITableColumn[] = [
    {
      label: ' ',
      field: ' ',
      filterList: false,
      maxWidth: 80,
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },
    {
      label: 'Subscriber ID',
      field: 'subscriberId',
      sortable: true,
      filterList: false,
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },

    {
      label: 'Display Name', field: 'displayName', sortable: true,
      filterList: false,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
    {
      label: 'Route ID', field: 'routeId', sortable: true, filterList: true,

      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
    {
      label: 'Occupation', field: 'occupation', sortable: true, filterList: true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
  ];

  getSubscriberById(id: string): void {
    // this.chitGroup=0
    // this.service.getsubscriberById(id).subscribe(
    //   data => {
    //     this.subscriberDetail = data;
    //     this.service.getChitGroupById(this.subscriberDetail.Subscriber.subscriberId).subscribe(
    //       response => {
    //         this.chitGroup = response
    //         this.chitGroup = this.chitGroup.length
    //       },
    //     );
    //   },
    //   error => {
    //   }
    // );
  }
}
