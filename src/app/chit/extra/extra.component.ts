import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { CellClickedEvent } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.css'
})
export class ExtraComponent implements OnInit {
  @Input() chitData:any
  purchaseData:any
  chitDetail:any
  isChitShow:boolean= false;
  recDate:any
  extraData:any
  recTime:any
  datas:any
  groupId:string
  extraPayments:boolean=false
  extraDatas:any
  extraChitData:any
  constructor( private fb: FormBuilder,private paymentService:PaymentService,private service: ChitService,
  ){}
  
  ngOnInit(): void {
    this.groupId=this.chitData?.chitGroupId

    this.getTicketIdData()

}

async getTicketIdData() {
  const res = await this.service.getTicketId(this.chitData?.chitGroupId).toPromise();
  this.purchaseData = res.purchaseData.map(item => ({
    passbookNumber: item.purchaseChitData?.passbookNumber,
    subscriberName: item.purchaseChitData?.subscriberName,
    winningBid: item.purchaseChitData?.winningBid,
    prizedAmount: item.purchaseChitData?.prizedAmount,
    viewDetails:"View Details",
    id:item._id
    // Add any other fields you want to display
  }));  

  this.extraData = res.extraData.map(item => ({
    passbookNumber: item.extraPaymentData?.passbookNumber,
    subscriberName: item.extraPaymentData?.subscriberName,
    winningBid: item.extraPaymentData?.winningBid,
    prizedAmount: item.extraPaymentData?.prizedAmount,
    viewDetails:"View Details",
    id:item._id
    // Add any other fields you want to display
  }));  

  // Now you can use the data outside the async block
}

redeemedColumn: ITableColumn[] = [
  {
    label: 'Passbook Number',
    field: 'passbookNumber',
    filter: false,

  },
  { label: 'Name', field: 'subscriberName' },
  { label: 'Winning Bid', field: 'winningBid' },
  { label: 'Prized Amount', field: 'prizedAmount' },
  // { label: 'Balance', field: 'balance' },
  { label: ' ', field: 'viewDetails',
    cellStyle: function (params: any) {
      return { color: '#50A1A5' ,cursor:'pointer'};
    },
    onCellClicked: (event: CellClickedEvent) =>
    
      this.getDataById(event.data.id)
  },
];


column: ITableColumn[] = [
  {
    label: 'Passbook Number',
    field: 'passbookNumber',
    filter: false,

  },
  { label: 'Name', field: 'subscriberName' },
  { label: 'Winning Bid', field: 'winningBid' },
  { label: 'Prized Amount', field: 'prizedAmount' },
  // { label: 'Balance', field: 'balance' },
  { label: ' ', field: 'viewDetails',
    cellStyle: function (params: any) {
      return { color: '#50A1A5' ,cursor:'pointer'};
    },
    onCellClicked: (event: CellClickedEvent) =>
    
      this.getExtraDataById(event.data.id)
  },
];

getDataById(id: any) {
  this.service.getAuctionById(id).subscribe(
    (data) => {
      this.datas = data.data;
      this.chitDetail = data.data.purchaseChitData;

      // Show modal with the fetched data
      this.isChitShow = true;
      const createdAtDate = new Date(this.datas.updatedAt);
      this.recDate = createdAtDate.toISOString().split('T')[0];
      this.recTime = createdAtDate.toLocaleTimeString();
    },
    (error) => {
      console.error('Error fetching subscriber', error);
    }
  );
}

getExtraDataById(id: any) {
  this.service.getAuctionById(id).subscribe(
    (data) => {
      this.extraDatas = data.data;
      this.extraChitData = data.data.extraPaymentData;

      // Show modal with the fetched data
      this.extraPayments = true;
      const createdAtDate = new Date(this.extraDatas.updatedAt);
      this.recDate = createdAtDate.toISOString().split('T')[0];
      this.recTime = createdAtDate.toLocaleTimeString();
    },
    (error) => {
      console.error('Error fetching subscriber', error);
    }
  );
}


showModal(): void {
  this.isChitShow=true
  console.log("showwwwwww");
  
}


showExtra(): void {
  this.extraPayments=true
}


close() {
  this.isChitShow = false;
}

closeExtra() {
  this.extraPayments = false;
}

}
