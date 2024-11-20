import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { ChitService } from '../shared/service/chit.service';
import { group } from '@angular/animations';
import { ITableColumn } from '../../shared/interface/list-table';
import { CellClickedEvent } from 'ag-grid-community';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tkn',
  templateUrl: './tkn.component.html',
  styleUrl: './tkn.component.css'
})
export class TknComponent implements OnInit {
  time: any
  date: any
  @Input() subscriber: any
  @Input() chitData: any
  groupId: string;
  redeemLen: number
  walletBalance: any
  subDetails: any
  redeemForm: FormGroup;
  chitSubscriberTotal: number = 0
  redeemData: any
  tknData: any
  chitDetail: any
  recDate: any
  recTime: any
  receipt: any
  month: any
  showDetails: boolean = false
  year: any
  isChitShow: boolean = false;
  auctionStart: boolean = false
  isConfirmationModalOpen: boolean = false;
  invoiceGen: boolean = false
  isModalOpen: boolean = false
  constructor(
    private fb: FormBuilder,
    private service: ChitService,
    private paymentService: PaymentService) { }
  ngOnInit(): void {
    this.redeemForm = this.fb.group({
      tknWallet: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      passbookNumber: ['PB-', [Validators.required]],
      groupId: ['', [Validators.required]],
      prizedAmount: ['', [Validators.required]],
      subscriberName: ['', [Validators.required]],
      redeem: [false]
    },
    )
    const auctionStart = this.redeemForm.get('redeem')?.value;
    if (auctionStart) {
      this.redeemForm.enable();
      this.redeemForm.get('redeem')?.enable();
      this.redeemForm.patchValue({
        passbookNumber: 'PB-'
      })
      this.auctionStart = false

    } else {
      this.redeemForm.disable();
      this.redeemForm.get('redeem')?.enable();
      this.auctionStart = true

    }
    this.groupId = this.chitData?.chitGroupId
    this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
      this.walletBalance = response
      this.walletBalance = this.walletBalance.payment
      this.walletBalance.forEach(amount => {
        this.chitSubscriberTotal = amount.walletBalance
      });
    })
    this.getTicketIdData()
  }
  onInputChange(event: any) {

    let inputValue = event.target.value;
    if (!inputValue.startsWith('PB-')) {
      this.redeemForm.patchValue({
        passbookNumber: 'PB-'
      });
    }
  }

  blockPrefix(event: any) {
    const inputValue = this.redeemForm.get('passbookNumber')?.value;
    if (event.target.selectionStart < 3 && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  async getTicketIdData() {
    const res = await this.service.getTicketId(this.chitData?.chitGroupId).toPromise();
    this.redeemLen = res.redeemData.length
    this.redeemData = res.redeemData.map(item => ({
      passbookNumber: item.TKNData?.passbookNumber,
      subscriberName: item.TKNData?.subscriberName,
      tknWallet: item.TKNData?.tknWallet,
      prizedAmount: item.TKNData?.prizedAmount,
      balance: item.TKNData?.balance,
      viewDetails: "View Details",
      id: item._id
      // Add any other fields you want to display
    })); this.tknData = res.tknData;
    // Now you can use the data outside the async block
  }


  toggleFormReedem(redeem: boolean, data: any) {
    const redeemBool = this.redeemForm.get('redeem')?.value;
    this.redeemForm.patchValue({
      tknWallet: data.TKNData.tknWallet,
      groupId: data.groupId,
    });
    const passbookInput = document.getElementById('passbookNumber') as HTMLInputElement;
    const prizedAmountInput = document.getElementById('prizedAmount') as HTMLInputElement;
    if (redeemBool) {
      this.redeemForm.enable();
      this.auctionStart = false
      passbookInput?.removeAttribute('readonly');
      prizedAmountInput?.removeAttribute('readonly');
    }
    else {
      passbookInput?.setAttribute('readonly', 'true');
      prizedAmountInput?.setAttribute('readonly', 'true');
      this.redeemForm.get('auctionStart')?.enable();
      this.auctionStart = true

    }
  }
  balance(prizedAmount: any, data: any) {
    const prizedAmt = prizedAmount
    const balanceValue = data.TKNData.tknWallet - prizedAmt;
    this.redeemForm.patchValue({
      balance: balanceValue
    });
  }
  subData(passNo: any, data: any) {
    const passbookNumber = passNo
    this.service.findTicketInGroup(this.groupId, passbookNumber).subscribe((res) => {
      if (res.purchase === true) {
        this.redeemForm.get('passbookNumber')?.setErrors({ ticketExists: true });
      } else if (res.result === true) {
        this.redeemForm.get('passbookNumber')?.setErrors({ ticketExists: true });
      }
      else {
        this.redeemForm.get('passbookNumber')?.setErrors(null);
      }
      if (passbookNumber && this.groupId) {
        this.service.getByPassbooNo(passbookNumber).subscribe((details) => {
          this.subDetails = details
          this.redeemForm.patchValue({
            subscriberName: `${this.subDetails.subscriberDetails.firstName} ${this.subDetails.subscriberDetails.aliasName}`,
          });
        });
      }
    })


  }

  redeem(data: any) {
    this.getTicketIdData()

    const payload = {
      groupId: this.redeemForm.value.groupId,
      walletBalance: data.TKNData.walletBalance,

      TKNData: {
        foremanCommision: data.TKNData.foremanCommision,
        winningBid: data.TKNData.winningBid,
        prizedAmount: this.redeemForm.value.prizedAmount,
        tknWallet: this.redeemForm.value.tknWallet,
        balance: this.redeemForm.value.balance,
        type:"TKN Company",
        date:data.TKNData.date,
        walletBalance: data.TKNData.walletBalance,
        subscriberName: this.redeemForm.value.subscriberName,
        passbookNumber: this.redeemForm.value.passbookNumber,
        occupation: this.subDetails.subscriberDetails.occupation,
        location: this.subDetails.subscriberDetails.place,
        auctionCycle: data.TKNData.auctionCycle,
        redeem: true
      },
    }
    this.openModal()
    this.service.saveAuctionDetails(payload, data._id).subscribe((response: any) => {
      const createdAtDate = new Date(response.data.createdAt);
      this.getTicketIdData()
      this.redeemForm.reset()

      this.date = createdAtDate.toISOString().split('T')[0]; // Formats the date
      this.time = createdAtDate.toLocaleTimeString();  // Formats the time
      this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
      this.year = createdAtDate.getFullYear();  // Year

      this.receipt = {
        time: this.time,
        date: this.date,
        prizedAmount: response.data.TKNData.prizedAmount,
        subscriberName: response.data.TKNData.subscriberName,
        groupId: response.data.groupId,
        passbookNo: response.data.TKNData.passbookNumber,
        winningBid: response.data.TKNData.winningBid,
        location: response.data.TKNData.location,
        occupation: response.data.TKNData.occupation,
        auctionCycle: response.data.TKNData.auctionCycle,
        foremanCommision: response.data.TKNData.foremanCommision,
      }
    });
  }
  getDataById(id: any) {
    this.service.getAuctionById(id).subscribe(
      data => {
        this.chitDetail = data.data;
        this.isChitShow = true
        this.showModal()
        const createdAtDate = new Date(this.chitDetail.updatedAt);

        this.date = createdAtDate.toISOString().split('T')[0]; // Formats the date
        this.time = createdAtDate.toLocaleTimeString();  // Formats the time
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
  }

  redeemedColumn: ITableColumn[] = [
    {
      label: 'Passbook Number',
      field: 'passbookNumber',
      filter: false,
    },
    { label: 'Name', field: 'subscriberName' },
    { label: 'TKN Amount', field: 'tknWallet' },
    { label: 'Prized Amount', field: 'prizedAmount' },
    { label: 'Balance', field: 'balance' },
    {
      label: ' ', field: 'viewDetails',
      cellStyle: function (params: any) {
        return { color: '#50A1A5', cursor: 'pointer' };
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.getDataById(event.data.id)
    },
  ];

  showModal(): void {
    this.showDetails = true
  }

  downloadAsPDF() {
    const element = document.getElementById('print-section');
    element.style.width = '700px';  // Adjust according to your modal's size

    html2canvas(element, {
      scale: 2, // Increase the scale to improve image quality
      useCORS: true,  // Enable cross-origin resource sharing if images are hosted externally
      allowTaint: true // Allow cross-origin images to be rendered into the canvas
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Initialize jsPDF (Portrait orientation, Millimeters, A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculate the width and height to fit the content on A4 page size
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);

      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`${this.receipt.subscriberName}.pdf`);
      element.style.width = '';
    });
  }
  print() {
    const printContent = document.getElementById('print-section').innerHTML;
    const originalContent = document.body.innerHTML;
    // Replace body content with modal content
    document.body.innerHTML = printContent;

    // Trigger print
    window.print();

    // Revert body content
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore state
  }

  openModal() {
    this.isModalOpen = true;
  }

  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  openConfirmationModal() {
    this.closeModal();  // Close the modal after creating the invoice

    this.isConfirmationModalOpen = true;
  }

  // Function to close the confirmation modal
  closeConfirmationModal() {
    this.isConfirmationModalOpen = false;
  }

  invoice() {
    this.isConfirmationModalOpen = false;

    this.invoiceGen = true
  }
  close() {
    this.invoiceGen = false
  }
  closeModel() {
    this.showDetails = false
  }
}

