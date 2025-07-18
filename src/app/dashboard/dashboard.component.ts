import { Component, OnInit } from '@angular/core';
import { ChitService } from '../chit/shared/service/chit.service';
import { Router } from '@angular/router';
import { SubscriberService } from '../subscriber/shared/service/subscriber.service';
import { StaffService } from '../staff/shared/service/staff.service';
import { AreaService } from '../area/shared/service/area.service';
import { PaymentService } from '../payments/shared/service/payment.service';
import { ITableColumn } from '../shared/interface/list-table';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  filterForm: FormGroup;
  filteredRecords = [];
  amounts: any;
  Allamount: any[] = []
  highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  auctions: any
  chitdata: any;
  subs_totalCount: number
  subscriberData: any
  staffData: any
  staff_totalCount: number
  chit_total: number
  routeData: any
  routeList: any[] = []
  auction_completed: any
  upcoming_auctions: any
  routeId: any;
  transactiondata: any;
  transfilterData = [];
  showGroups: boolean = false
  displayedAuctions: any

  constructor(private fb: FormBuilder, private payment_service: PaymentService, private route_service: AreaService, private chit_service: ChitService, private router: Router, private sub_service: SubscriberService, private staff_service: StaffService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {

    this.filterForm = this.fb.group({
      date: [''],
      route: [''],
    });
    const yesterday = this.getYesterdayDate();
    this.filterForm.patchValue({ date: yesterday });
    this.filterRecords();

    // Listen to form changes for dynamic filtering
    this.filterForm.valueChanges.subscribe(() => {
      this.filterRecords();
    });

    this.chit_service.getAuctionToday().subscribe((data => {
      this.auctions = data
      this.auctions = this.auctions.todaysAuction
      this.displayedAuctions = this.auctions.slice(0, 5)
    }))

    this.payment_service.getPaymentByYear().subscribe((data) => {

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('No valid data received from API');
        return;
      }

      this.Allamount = data.map((item: { year: number; amount: number[] }) => ({
        year: item.year,
        amount: Array.isArray(item.amount) ? item.amount : new Array(12).fill(0)
      }));

      this.chartOptions = {
        chart: { type: 'line' },
        title: { text: 'Payments Done' },
        subtitle: { text: 'By Subscribers' },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        yAxis: { title: { text: 'Total Amount' }, min: 0 },
        series: this.Allamount.map((item) => ({
          type: 'line',
          name: item.year.toString(),
          data: item.amount
        }))
      };
      // Manually trigger the chart rendering
      Highcharts.chart('chartContainer', this.chartOptions);
      // Trigger Angular change detection to update the UI
      this.cdr.detectChanges();
    });
    this.sub_service.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      this.subs_totalCount = this.subscriberData.AllSubscriber.length
    });
    this.staff_service.getstaffAll().subscribe((data) => {
      this.staffData = data;
      this.staff_totalCount = this.staffData.AllStaff.length
    })
    this.chit_service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups

      this.chit_total = this.chitdata.length
    });
    this.route_service.getrouteAll().subscribe((data) => {
      this.routeData = data;
      this.routeList = this.routeData.AllRoute.map((route: any) => ({
        id: route._id,
        routeId: route.routeId
      }));
    });
    this.payment_service.getPaymentByMonth().subscribe((data) => {
      this.amounts = data;
    });
    this.chit_service.getAuctionCompleted().subscribe((data) => {
      this.auction_completed = data;
    });
    this.payment_service.getPaymentByDate().subscribe((data) => {
      this.transactiondata = data;
      this.transfilterData = this.transactiondata.map((transaction: any) => ({
        name: transaction.subscriberName,
        passbook: transaction.passbooknumber,
        groupId: transaction.groupId,
        amount: transaction.amount,
        date: new Date(transaction.createdAt).toISOString().split('T')[0],
        route: transaction.region
      }));
      this.filterRecords();
    });
  }

  // Function to get yesterday's date in 'YYYY-MM-DD' format
  private getYesterdayDate(): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const day = yesterday.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  filterRecords(): void {
    const { date, route } = this.filterForm.value;

    this.filteredRecords = this.transfilterData.filter((data) => {
      const matchesDate = date ? data.date === date : true;
      const matchesRoute = route ? data.route === route : true;
      return matchesDate && matchesRoute;
    });

  }

  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    // const subscriberId = params.data.subscriberId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="32" height="32" style="border-radius: 50%; ">
      </div>
    `;
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
