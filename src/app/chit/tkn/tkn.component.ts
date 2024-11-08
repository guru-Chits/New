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
  tknForm: FormGroup;
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
  showDetails:boolean=false
  year: any
  isChitShow: boolean = false;
  auctionStart: boolean = false
  isConfirmationModalOpen: boolean = false;
  invoiceGen:boolean=false
  isModalOpen:boolean=false
  constructor(
    private fb: FormBuilder,
    private service: ChitService,
    private paymentService: PaymentService,
  ) {
  }
  ngOnInit(): void {
    //   this.tknForm = this.fb.group({
    //     groupId: ['',[Validators.required]],
    //     walletBalance: ['',[Validators.required]],
    //     foremanCommision: ['',[Validators.required]],
    //     winningBid: ['',[Validators.required]],
    //     prizedAmount: ['',[Validators.required]],
    //     // ticketId: ['',[Validators.required]],
    //     // subscriberName: ['',[Validators.required]],
    //     // passbookNumber: ['',[Validators.required]],
    //     auctionCycle: ['',[Validators.required]],
    //     isActive: [,[Validators.required]]
    //   },

    // );
    // const isActive=this.tknForm.get('isActive')?.value;
    // console.log(isActive);

    // if (isActive) {

    //   this.tknForm.enable();
    //   this.tknForm.get('isActive')?.enable();
    //   this.auctionStart=false


    // } else {
    //   this.tknForm.disable();
    //   this.tknForm.get('isActive')?.enable();
    //   this.auctionStart=true

    // }

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
    // this.tknForm.get('isActive')?.valueChanges.subscribe(() => {
    //   console.log(this.tknForm.get('isActive')?.value);

    // });


    this.groupId = this.chitData?.chitGroupId
    this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
      console.log(response);
      this.walletBalance = response
      this.walletBalance = this.walletBalance.payment
      this.walletBalance.forEach(amount => {
        this.chitSubscriberTotal = amount.walletBalance
        console.log(this.chitSubscriberTotal, "red");
        this.tknForm.patchValue({
          walletBalance: this.chitSubscriberTotal
        })
      });
    })


    this.getTicketIdData()
    this.tknForm.patchValue({
      walletBalance: this.chitSubscriberTotal,
      groupId: this.groupId,
      foremanCommision: this.chitData?.foremanCommission,
    })



    // if(groupId){
    //   this.service.getAuctionCycleByGroupId(groupId).subscribe((data) => {
    //     const cycle = data
    //     console.log('increased cycle', cycle)
    //     this.tknForm.patchValue({
    //       auctionCycle: `${cycle?.auctionCycle}`
    //     })
    //   })
    // }

  }




  // winningBidChange(){
  //     const winningBid=this.tknForm.get('winningBid').value
  //     const prizedAmount=this.chitData?.chitAmount-winningBid
  //     const finalprizedAmount = this.tknForm.get('prizedAmount').value;
  //   const walletBalance = this.chitSubscriberTotal
  //   const sumOfTwo =prizedAmount+this.chitData.foremanCommission
  //   console.log('sum of Two', sumOfTwo)
  //   const finalWallet = this.chitSubscriberTotal - sumOfTwo
  //   console.log('final value', finalWallet)

  //   this.tknForm.patchValue({
  //       prizedAmount:prizedAmount,
  //       walletBalance: finalWallet
  //     });

  // }
  // amountLessThanOrEqualChitAmount(ticketIdControl: string) {
  //   return (formGroup: AbstractControl): ValidationErrors | null => {
  //     const ticketId = formGroup.get(ticketIdControl)?.value;

  //     const maxLen = this.chitData.chitSubscribers.length
  //     const minLen = 1

  //     // Check if ticketId is a number and falls between minLen and maxLen
  //     if (ticketId !== null && (ticketId < minLen || ticketId > maxLen)) {
  //       // Return validation error if the ticketId is out of range
  //       return { ticketIdOutOfRange: `Ticket ID must be between ${minLen} and ${maxLen}` };
  //     }

  //     // No error if validation passes
  //     return null;
  //   };
  // }

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
      passbookNumber:item.TKNData?.passbookNumber,
      // ticketId: item.TKNData?.ticketId,
      subscriberName:item.TKNData?.subscriberName,
      tknWallet: item.TKNData?.tknWallet,
      prizedAmount: item.TKNData?.prizedAmount,
      balance: item.TKNData?.balance,
      viewDetails: "View Details",
      id: item._id
      // Add any other fields you want to display
    })); this.tknData = res.tknData;

    console.log('Redeem Length:', res);
    console.log('TKN Data:', this.tknData);

    // Now you can use the data outside the async block
  }


  toggleFormReedem(redeem: boolean, data: any) {
    // Patch the form values with the selected item data

    this.redeemForm.patchValue({
      // redeem: true,
      tknWallet: data.TKNData.tknWallet,
      // balance: data.balance,
      groupId: data.groupId,

      // ticketId: data.ticketId,
      // passbookNumber: data.passbookNumber,
      // subscriberName: data.subscriberName,
    });
  }
  balance(prizedAmount: any, data: any) {
    const prizedAmt = prizedAmount

    const balanceValue = data.TKNData.tknWallet - prizedAmt;

    console.log(data.tknWallet);
    console.log(prizedAmt);

    console.log(balanceValue);

    this.redeemForm.patchValue({
      balance: balanceValue
    });
  }
  subData(passNo: any, data: any) {
    const passbookNumber = passNo

    this.service.findTicketInGroup(this.groupId, passbookNumber).subscribe((res) => {
      console.log("res tickeer id", res.purchase);
      if (res.purchase === true) {
        // Set a validation error if the ticket already exists
        console.log('error');

        this.redeemForm.get('passbookNumber')?.setErrors({ ticketExists: true });
      } else if (res.result === true) {
        // Set a validation error if the ticket already exists
        this.redeemForm.get('passbookNumber')?.setErrors({ ticketExists: true });
      }
      else {
        // Clear the validation error if the ticket does not exist
        this.redeemForm.get('passbookNumber')?.setErrors(null);
      }

      // You can call this after validation to handle other logic
      if (passbookNumber && this.groupId) {
        this.service.getByPassbooNo(passbookNumber).subscribe((details) => {
          console.log(details);
          this.subDetails = details
          console.log(this.subDetails);

          this.redeemForm.patchValue({
            subscriberName: `${this.subDetails.subscriberDetails.firstName} ${this.subDetails.subscriberDetails.aliasName}`,
            // passbookNumber: this.subDetails.chitDetails.passbookNo,

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
        subscriberName: this.redeemForm.value.subscriberName,
        passbookNumber: this.redeemForm.value.passbookNumber,
        occupation:this.subDetails.subscriberDetails.occupation,
        location:this.subDetails.subscriberDetails.place,
  
        // isActive:this.redeemForm.value.isActive,
        auctionCycle: data.TKNData.auctionCycle,
        redeem: true
      },
    }
    console.log(payload);
    this.openModal()
    this.service.saveAuctionDetails(payload, data._id).subscribe((response: any) => {
      console.log(response);
      console.log(response.data.TKNData);
      console.log(response.data.createdAt);
      console.log(response.data.createdAt);
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
        location:response.data.TKNData.location,
        occupation:response.data.TKNData.occupation,
        auctionCycle:response.data.TKNData.auctionCycle,
        foremanCommision:response.data.TKNData.foremanCommision,

      }

    });


  }
  getDataById(id: any) {
    console.log(id)
    this.service.getAuctionById(id).subscribe(
      data => {
        this.chitDetail = data.data;
        this.isChitShow = true
        this.showModal()
        const createdAtDate = new Date(this.chitDetail.updatedAt);

        this.date = createdAtDate.toISOString().split('T')[0]; // Formats the date
        this.time = createdAtDate.toLocaleTimeString();  // Formats the time
        console.log(this.chitDetail)
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
        // console.log(event.data)

        this.getDataById(event.data.id)
    },
  ];

  showModal(): void {

    this.showDetails=true
    // setTimeout(() => {
    //   const modal = document.getElementById('purchaseDetailModel');
    //   if (modal) {
    //     modal.style.display = 'block';
    //   }
    // }, 0);
  }

  downloadAsPDF() {
    const element = document.getElementById('print-section');

    // Set the width to ensure correct layout
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
    console.log(originalContent);

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
  
  createInvoice() {
    // Add logic here to create an invoice
    console.log("Invoice created");
  }
  
  openConfirmationModal() {
    this.closeModal();  // Close the modal after creating the invoice
  
    this.isConfirmationModalOpen = true;
  }
  
  // Function to close the confirmation modal
  closeConfirmationModal() {
    this.isConfirmationModalOpen = false;
  }
  
  invoice(){
    this.isConfirmationModalOpen = false;
  
    this.invoiceGen=true
  }
  close(){
    this.invoiceGen=false
  }

  closeModel(){
    this.showDetails=false
  }
  
}

