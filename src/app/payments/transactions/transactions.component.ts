import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AreaService } from '../../area/area.service';
import { ChitService } from '../../chit/shared/service/chit.service';
import { StaffService } from '../../staff/shared/service/staff.service';
import { PaymentService } from '../shared/service/payment.service';
import { ITableColumn } from '../../shared/interface/list-table';
import { CellClickedEvent } from 'ag-grid-community';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; 
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{
  routeData:any
  routes:any[]=[]
  data:any[]=[]
  transData:any
  searchImg:string='assets/table/black search.svg'
  filterImg:string='assets/table/black filter.svg'
  search:boolean=true
  totalAmount: number = 0;
  totalRecords: number = 0;
  transactionForm:FormGroup
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: PaymentService,
    private staffService:StaffService,
    private chitService:ChitService,
    private routeService:AreaService) { }

ngOnInit(): void {
  this.transactionForm=this.formBuilder.group({
    fromDate:['', [Validators.required]],
    toDate:['', [Validators.required]],
    routeId:['', [Validators.required]],
    collectionType:['', [Validators.required]],
    collectionTypeCount:['', [Validators.required]],
    collectionTypeAmount:['', [Validators.required]],
    totalSerialNumberCount:['', [Validators.required]],
    grandTotalAmount:['', [Validators.required]],
  })

 this.formChanges()



}

column: ITableColumn[] = [
  {
    label: 'Serial No',
    field: 'sno',
    filter:false,
  },
  {
    label: 'Receipt Number',
    field: 'receiptNumber',
    filter:false,
  },
  {
    label: 'Passbook Number',
    field: 'passbooknumber',
    filter:true,
  },
  {
    label: 'Group Id',
    field: 'groupId',
    filter:true,
  },
  
  {
    label: 'Amount Paid',
    field: 'amount',
    filter:false,
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

    // Calculate and format the grandTotalAmount
    const grandTotal = this.data.reduce((total, item) => total + parseFloat(item.amount), 0);
    const formattedGrandTotal = grandTotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Update the totalSerialNumberCount and grandTotalAmount
    this.transactionForm.patchValue({
      totalSerialNumberCount: this.data.length,
      grandTotalAmount: formattedGrandTotal
    });
  });

  // Fetch the route data based on the selected date range
  this.service.getRouteByDate(fromDate).subscribe(data => {
    this.routeData = data;
    this.routes = this.routeData.region.map(routeDetails => ({
      routeId: routeDetails
    }));
  });
}

// Fetch data filtered by date range and routeId
fetchDataByRoute(fromDate: string, toDate: string, routeId: string) {
  this.service.getDataByDate(fromDate, toDate, routeId).subscribe(data => {
    this.transData = data;

    // Map filtered data
    this.data = this.transData.details.map((transDetails, index) => ({
      id: transDetails._id,
      sno: index + 1,
      date: transDetails.date,
      receiptNumber: transDetails.receiptNumber,
      passbooknumber: transDetails.passbooknumber,
      groupId: transDetails.groupId,
      amount: transDetails.amount
    }));

    // Calculate and format the grandTotalAmount for filtered data
    const grandTotal = this.data.reduce((total, item) => total + parseFloat(item.amount), 0);
    const formattedGrandTotal = grandTotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Update the totals for filtered data
    this.transactionForm.patchValue({
      totalSerialNumberCount: this.data.length,
      grandTotalAmount: formattedGrandTotal
    });
  });
}



  onSubmit(){

  }

  clear(){
    this.totalAmount = 0;
    this.totalRecords = 0;  
    this.transactionForm.reset()
    this.formChanges()

  }
  downloadAsPDF() {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define the columns and rows for the table
    const columns = this.column.map(col => col.field); // Get the column headers
    const rows = this.data.map(row => 
      this.column.map(col => row[col.field]) // Get the row data for each column
    );

    // Add a title to the PDF
    doc.text('Table Summary', 14, 10);

    // Use autoTable to generate the table
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20, // Start the table below the title
    });

    // Save the generated PDF
    doc.save('table-summary.pdf');
  }
}
