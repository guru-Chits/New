import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AreaService } from '../../area/area.service';
import { ChitService } from '../../chit/shared/service/chit.service';
import { StaffService } from '../../staff/shared/service/staff.service';
import { PaymentService } from '../shared/service/payment.service';
import { ITableColumn } from '../../shared/interface/list-table';
import { CellClickedEvent } from 'ag-grid-community';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { ServiceService } from '../../settings/shared/service.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  providers: [DatePipe]

})
export class TransactionsComponent implements OnInit {
  routeData: any
  routes: any[] = []

  colData: any
  data: any[] = []
  worksheetData: any
  fileName: string
  downloadData: any[] = []
  transData: any
  searchImg: string = 'assets/table/black search.svg'
  filterImg: string = 'assets/table/black filter.svg'
  search: boolean = true
  totalAmount: number = 0;
  totalRecords: number = 0;
  transactionForm: FormGroup
  filter: boolean = true
  collectionTypes: any
  private readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: PaymentService,
    private staffService: StaffService,
    private chitService: ChitService,
    private datePipe: DatePipe,
    private routeService: AreaService,
    private settings: ServiceService
  ) { }

  ngOnInit(): void {
    this.transactionForm = this.formBuilder.group({
      fromDate: ['', [Validators.required, this.validatePastOrTodayDate]],
      toDate: ['', [Validators.required, this.validatePastOrTodayDate]],
      routeId: ['',],
      collectionType: ['',],
      collectionTypeCount: ['',],
      collectionTypeAmount: ['',],
      totalSerialNumberCount: ['', [Validators.required]],
      grandTotalAmount: ['', [Validators.required]],
    })

    this.settings.getAllCollection().subscribe(
      (data) => {
        this.collectionTypes = data
        this.collectionTypes = this.collectionTypes.res
      }
    )
    this.formChanges()



  }

  validatePastOrTodayDate(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    return selectedDate <= today ? null : { invalidDate: true };
  }

  column: ITableColumn[] = [
    {
      label: 'Serial No',
      field: 'sno',
      filterList: false,
    },
    {
      label: 'Receipt Number',
      field: 'receiptNumber',
      filterList: false,
    },
    {
      label: 'Passbook Number',
      field: 'passbooknumber',
      filterList: true,
    },
    {
      label: 'Group Id',
      field: 'groupId',
      filterList: true,
    },

    {
      label: 'Amount Paid',
      field: 'amount',
      filterList: false,
      cellStyle: { color: '#12B76A' },
    },
  ];


  formChanges() {
    // Subscribe to changes in both 'fromDate' and 'toDate'
    this.transactionForm.get('fromDate').valueChanges.subscribe(fromDate => {
      this.handleDateChange(fromDate, this.transactionForm.get('toDate').value);
    });

    this.transactionForm.get('toDate').valueChanges.subscribe(toDate => {
      this.handleDateChange(this.transactionForm.get('fromDate').value, toDate);
    });

    // Subscribe to changes in 'routeId'
    this.transactionForm.get('routeId').valueChanges.subscribe(routeId => {
      const fromDate = this.transactionForm.get('fromDate').value;
      const toDate = this.transactionForm.get('toDate').value;
      if (fromDate && toDate && routeId) {

        // Fetch data filtered by date range and routeId
        this.fetchDataByRoute(fromDate, toDate, routeId);

        this.transactionForm.get('collectionType').valueChanges.subscribe(collectionType => {
          const colType = collectionType
          this.service.getDataByCollection(fromDate, toDate, routeId, colType).subscribe(data => {
            if (data) {
              this.colData = data
              const grandTotal = this.colData.details.reduce((total, item) => total + parseFloat(item.amount), 0);
              const formattedGrandTotal = grandTotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });
              this.transactionForm.patchValue({
                collectionTypeCount: this.colData.details.length,
                collectionTypeAmount: formattedGrandTotal
              });
            }
          })
        })
      }
    });
  }

  // Handle fetching data when 'fromDate' or 'toDate' changes
  handleDateChange(fromDate: string, toDate: string) {
    // Reset the routeId field whenever the date range changes
    this.transactionForm.controls['routeId'].reset();

    if (!fromDate || !toDate) {
      // If either date is missing, clear the data and totals
      this.data = [];
      this.transactionForm.patchValue({
        totalSerialNumberCount: 0,
        grandTotalAmount: '0'
      });
      return;
    }

    // Call the service to fetch data by date range
    this.service.getDataByDate(fromDate, toDate).subscribe(data => {
      this.transData = data;

      // Map the data to the table structure
      this.data = this.transData.details.map((transDetails, index) => ({
        id: transDetails._id,
        sno: index + 1,
        date: transDetails.date,
        receiptNumber: transDetails.receiptNumber,
        passbooknumber: transDetails.passbooknumber,
        groupId: transDetails.groupId,
        amount: transDetails.amount
      }));


      this.downloadData = this.transData.details.map((transDetails, index) => ({
        SNo: index + 1,
        RouteId: transDetails.region,
        SubscriberId: transDetails.subscriberId,
        PassbookNumber: transDetails.passbooknumber,
        SubscriberName:transDetails.subscriberName,
        CollectionDate:transDetails.date,
        receiptNumber: transDetails.receiptNumber,
        InstallmentMonth: transDetails.installmentMonth,
        CollectionType: transDetails.collectionType,
        chitAmount:transDetails.chitAmount,
        Amount: transDetails.amount
      }));


      // Calculate and format the grandTotalAmount
      const grandTotal = this.data.reduce((total, item) => total + parseFloat(item.amount), 0);
      const formattedGrandTotal = grandTotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      this.fileName = `${fromDate}-${toDate}`

      this.worksheetData = [
        // Add the first row for the title
        [{ v: 'Collection Summary', s: { font: { sz: 14, bold: true }, alignment: { horizontal: 'center' } } }],

        // Merge the title across the columns
        [],
        ['From Date:' + fromDate, 'To Date:' + toDate],

        // Add header row
        ['S No','Route Id', 'Collection Date', 'Passbook No.', 'Receipt No.', 'Installment Month','Subscriber ID', 'Subscriber Name', 'Collection Type', 'Chit Value','Amount'],

        // Add the data rows
        ...this.downloadData.map((data: any, index: number) => [
          index + 1,
          data.RouteId,
          this.datePipe.transform(data.CollectionDate, 'dd-MM-YYYY') || '',
          data.PassbookNumber,
          data.receiptNumber,
          data.InstallmentMonth,
          data.SubscriberId,
          data.SubscriberName,
          data.CollectionType,
          data.chitAmount,
          data.Amount
        ]),
        [],

        ['', '', '', '', '', '', '','','Amount', "₹" + formattedGrandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })]
      ];

      this.transactionForm.patchValue({
        totalSerialNumberCount: this.data.length,
        grandTotalAmount: formattedGrandTotal
      });
    });

    this.service.getRouteVerfiedByDate(fromDate, toDate).subscribe(data => {
      this.routeData = data;
      this.routes = this.routeData.region.map(routeDetails => ({
        routeId: routeDetails
      }));
    });
  }

  fetchDataByRoute(fromDate: string, toDate: string, routeId: string) {
    this.service.getDataByDate(fromDate, toDate, routeId).subscribe(data => {
      this.transData = data;
      this.transactionForm.patchValue({
        collectionType: '',
        collectionTypeCount: '',
        collectionTypeAmount: ''
      });
      this.data = this.transData.details.map((transDetails, index) => ({
        id: transDetails._id,
        sno: index + 1,
        date: transDetails.date,
        receiptNumber: transDetails.receiptNumber,
        passbooknumber: transDetails.passbooknumber,
        groupId: transDetails.groupId,
        amount: transDetails.amount
      }));

      this.downloadData = this.transData.details.map((transDetails, index) => ({
        SNo: index + 1,
        date: transDetails.date,
        subscriberId: transDetails.subscriberId,
        subscriberName: transDetails.subscriberName,
        chitAmount: transDetails.chitAmount,
        PassbookNumber: transDetails.passbooknumber,
        receiptNumber: transDetails.receiptNumber,
        amount: transDetails.amount,
        InstallmentMonth: transDetails.installmentMonth,
        CollectionType: transDetails.collectionType,

      }));


      // Calculate and format the grandTotalAmount for filtered data
      const grandTotal = this.data.reduce((total, item) => total + parseFloat(item.amount), 0);
      const formattedGrandTotal = grandTotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      this.fileName = `${fromDate}-${toDate}-${routeId}`
      this.worksheetData = [
        // Add the first row for the title
        [{ v: 'Collection Summary', s: { font: { sz: 14, bold: true }, alignment: { horizontal: 'center' }, } }],

        // Merge the title across the columns
        ['From Date:' + fromDate, 'To Date:' + toDate, 'Route ID:' + routeId],

        // Add header row
        ['S No',  'Collection Date', 'Passbook No.', 'Receipt No.', 'Installment Month','Subscriber ID', 'Subscriber Name', 'Collection Type', 'Chit Value','Amount'],

        // Add the data rows
        ...this.downloadData.map((data: any, index: number) => [
          index + 1,
          this.datePipe.transform(data.date, 'dd-MM-YYYY') || '',
          data.PassbookNumber,
          data.receiptNumber,
          data.InstallmentMonth,
          data.subscriberId,
          data.subscriberName,
          data.CollectionType,
          data.chitAmount,
          data.amount
        ]),

        [],
        ['', '', '', '','','', 'Amount', "₹" + formattedGrandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })]
      ];
      this.transactionForm.patchValue({
        totalSerialNumberCount: this.data.length,
        grandTotalAmount: formattedGrandTotal
      });
    });
  }

  exportToExcel(): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.worksheetData);

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
    ];

    // Add the worksheet to a new workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Collection Summary': worksheet },
      SheetNames: ['Collection Summary']
    };

    // Export the workbook to Excel file
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
  }

  // Function to calculate the total amount
  getTotalAmount(): number {
    return this.downloadData.reduce((total: number, item: any) => total + parseFloat(item.Amount), 0);
  }

  clear() {
    this.totalAmount = 0;
    this.totalRecords = 0;
    this.transactionForm.reset()
    this.formChanges()
  }
}
