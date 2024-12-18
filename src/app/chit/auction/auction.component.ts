import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { DatePipe } from '@angular/common';

interface SubscriberDetails {
  firstName: string;
  lastName: string;
  passbookNumber: string;
}

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css'],
  providers: [DatePipe]

})
export class AuctionComponent implements OnInit {
  activeTab: string = 'regular'; // Default active tab
  auctionForm: FormGroup;
  invoiceGen: boolean = false
  auctionData: any = {};
  selectedTicketId: any
  searchImg: string = 'assets/table/black search.svg';
  filterImg: string = 'assets/table/black filter.svg';
  search: boolean = true;
  data: any[] = [];
  chitData: any;
  color: any
  subscribers: any[] = [];
  groupId: string;
  date: any
  time: any
  month: string
  year: number
  ticketId: string
  receipt: any
  walletBalance: any
  chitSubscriberTotal = 0;
  subDetails: any
  purchase: boolean = false
  subCount: number
  extraCount: boolean = false
  regId: any[]
  extraId: any[]
  auctionCycle: any
  purId: any[]
  breadcrumsData: any
  auctionStart: boolean = false
  regular: boolean = false
  profitChit: boolean = false
  extraPayments: boolean = false
  purchaseChit: boolean = false
  tknCompany: boolean = false
  profitId: any
  isModalOpen: boolean = false;
  bidHistory: any
  showDetails: boolean = false
  invoiceClick: boolean = false
  chitDetail: any
  datas: any
  recDate: String
  objId: string
  recTime: String
  lastAuction: any
  preAuc: any
  amountOutstanding: any
  profitCount: any
  noReg: boolean = false
  purchaseId: string
  regularFirst: boolean = false
  colorCode: any
  isConfirmationModalOpen: boolean = false;
  isSubmitted: boolean = false;
  type: string
  monthFirst: boolean = false
  tknMonth: boolean = false
  // chitType: string = 'Regular Chit'; 

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: ChitService,
    private paymentService: PaymentService,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.auctionForm = this.fb.group({
      date: ['', [Validators.required]],
      auctionType: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
      walletBalance: ['', [Validators.required]],
      foremanCommision: ['', [Validators.required]],
      winningBid: ['', [Validators.required]],
      prizedAmount: ['', [Validators.required]],
      subscriberName: [''],
      passbookNumber: ['PB-'],
      auctionCycle: ['', [Validators.required]],
      auctionStart: [],
      amountOutstanding: ['']
    },);

    this.updatedChanges()
  }
  updatedChanges() {

    const auctionStart = this.auctionForm.get('auctionStart')?.value;
    if (auctionStart) {
      this.auctionForm.enable();
      this.auctionForm.get('auctionStart')?.enable();
      this.auctionForm.patchValue({
        passbookNumber: 'PB-'
      })
      this.auctionStart = false
      this.regular = false
      this.purchaseChit = false
      this.tknCompany = false
      this.extraPayments = false
      this.profitChit = false
      this.extraCount = false
      this.noReg=false
      this.regularFirst=false
      this.tknMonth=false
    } else {
      this.auctionForm.disable();
      this.auctionForm.get('auctionStart')?.enable();
      this.auctionStart = true

    }
    this.activatedRoute.params.subscribe(paramData => {

      if (Object.keys(paramData)?.length) {
        this.service.getChitById(paramData.id).subscribe((data) => {
          this.objId = paramData.id
          this.chitData = data;
          this.chitData = this.chitData.ChitsGroup;
          this.groupId = this.chitData.chitGroupId;

          // this.fetchTicketIds(this.groupId)
          this.breadcrumsData = [
            {
              key: 'Chit Management',
              routerLink: '/chit',
            },
            {
              key: `${this.groupId}`,
              routerLink: `chit/view/${paramData.id}`,
            },
            {
              key: `Auction Entry`,
              routerLink: `/chit/auction/${paramData.id}`,
            },
          ];
          const groupId = this.chitData?.chitGroupId
          this.groupId = groupId

          this.service.getTicketId(this.groupId).subscribe((res) => {

            this.colorCode = res
            const extraCount = this.colorCode?.extraTid?.length
            const extraNeeded = this.subCount - 20
            if (extraCount < extraNeeded) {
              this.extraCount = false
            }
            else {
              this.extraCount = true
            }
          });

          this.service.getTicketId(this.chitData.chitGroupId).subscribe((res) => {
            this.bidHistory = res.allData
            this.regularFirst = this.bidHistory?.length
            const firstAuction = this.bidHistory?.length || 0;
            this.regularFirst = firstAuction === 0;
            const date = this.chitData.auctionDate
            if (res?.lastChit?.passbookNumber && !res?.lastChit?.type) {
              this.noReg = true
            } else if (res?.lastChit?.type == "TKN Company") {
              this.tknMonth = true
            } else {
              this.noReg = false
              this.tknMonth = false
            }
            if (this.regularFirst) {
              this.auctionForm.patchValue({
                date: this.convertDateFormat(this.chitData.auctionDate)
              })
            } else if (this.noReg && !this.regularFirst || this.tknMonth) {
              this.auctionForm.patchValue({
                date: this.convertDateFormat(this.datePipe.transform(res.lastChit.date, 'dd-MM-yyyy'))
              })
            }
            else if (!this.noReg && !this.regularFirst || !this.tknMonth){
              let date = res.regular[res.regular.length - 1].date
              date = this.getNextMonthSameDate(date)
              this.auctionForm.patchValue({
                date: this.convertDateFormat(this.datePipe.transform(date, 'dd-MM-yyyy'))
              })

            }

            this.bidHistory = res.allData.map((history, index) => ({
              sNo: index + 1, // Use the index parameter and add 1 for serial number
              passbookNumber: history.passbookNumber,
              subscriberName: history.subscriberName,
              location: history.location,
              walletBalance: history.walletBalance,
              month: this.convertDateToMonth(history.date), // Convert the date to the month
              winningBid: history.winningBid,
              prizedAmount: history.prizedAmount,
              viewDetails: "View Details"
            }));
          });
          this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
            this.walletBalance = response
            this.walletBalance = this.walletBalance.payment
            this.walletBalance.forEach(amount => {
              this.chitSubscriberTotal = amount.walletBalance
              this.auctionForm.patchValue({
                walletBalance: this.chitSubscriberTotal
              })
            });
          })

          this.auctionForm.patchValue({
            walletBalance: this.chitSubscriberTotal,
            groupId: groupId,
            foremanCommision: this.chitData?.foremanCommission,
          })
          this.service.getLastCreatedAuction(this.chitData.chitGroupId).subscribe((res) => {

            if (res.auction.extraPaymentData) {

              this.lastAuction = res.auction.extraPaymentData
            } else if (res.auction.profitChitData) {
              this.lastAuction = res.auction.profitChitData

            } else if (res.auction.purchaseChitData) {
              this.lastAuction = res.auction.purchaseChitData

            }
            else if (res.auction.TKNData) {
              this.lastAuction = res.auction.TKNData
            } else {
              this.lastAuction = res.auction
            }

          });


          // const winningBid = this.auctionForm.get('winningBid')?.value;
          // const chitAm = this.chitData.chitAmount;
          // if (winningBid !== null && chitAm !== null){
          //   const prizedAmount = chitAm - winningBid;
          //   this.auctionForm.get('prizedAmount')?.setValue(prizedAmount, {emitEvent: false});
          // }
          this.service.getTicketId(this.chitData.chitGroupId).subscribe((res) => {
            this.amountOutstanding = res.totalPrizedAmount
            this.profitCount = res.profitCount
          })

          this.subscribers = this.chitData.chitSubscribers;
          this.subCount = this.subscribers.length


          // You can also store these values in separate arrays if needed
          this.subscribers = this.subscribers.map(subscriber => ({
            aliasName: subscriber.aliasName,
            firstName: subscriber.firstName,
            passbookNo: subscriber.passbookNo,
            place: subscriber.place,
            occupation: subscriber.occupation,
            subscriberId: subscriber.subscriberId,
            profileImageUrl: subscriber.profileImageUrl
          }));


          this.autofillForm();
        });
      }
    });
  }
  onInputChange(event: any) {
    let inputValue = event.target.value;
    if (!inputValue.startsWith('PB-')) {
      this.auctionForm.patchValue({
        passbookNumber: 'PB-'
      });
    }
  }
  convertDateFormat(dateStr: string): string {
    if (!dateStr) {
      return '';
    }
    const dateParts = dateStr.split("-");
    if (dateParts.length !== 3) {
      return '';
    }
    const [day, month, year] = dateParts;
    if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
      return '';
    }
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
  convertDateToMonth(dateString: string): string {
    const date = new Date(dateString); // Parse the ISO date string into a Date object
    return date.toLocaleString('default', { month: 'long' }); // Extract the month name
  }


  blockPrefix(event: any) {
    const inputValue = this.auctionForm.get('passbookNumber')?.value;
    if (event.target.selectionStart < 3 && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  getDataById(id: any) {
    this.service.getSubAuction(id).subscribe(
      data => {

        if (data.subscriberAuc.extraPaymentData) {
          this.type = "Extra Payments"
          this.chitDetail = data.subscriberAuc.extraPaymentData;
        } else if (data.subscriberAuc.profitChitData) {
          this.type = "Profit Chit"
          this.chitDetail = data.subscriberAuc.profitChitData;
        } else if (data.subscriberAuc.purchaseChitData) {
          this.type = "Purchase Chit"
          this.chitDetail = data.subscriberAuc.purchaseChitData;
        } else if (data.subscriberAuc.TKNData) {
          this.type = "TKN company"
          this.chitDetail = data.subscriberAuc.TKNData;
        } else {
          this.type = "Regular Chit"
          this.chitDetail = data.subscriberAuc;
        }

        this.showDetails = true
        this.datas = data.subscriberAuc;

        this.showModal()
        const createdAtDate = new Date(this.datas.createdAt);
        this.recDate = createdAtDate.toISOString().split('T')[0]; // Formats the date
        this.recTime = createdAtDate.toLocaleTimeString();  // Formats the time
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );

  }
  autofillForm(): void {
    const chitDetails = {
      groupId: this.chitData?.chitGroupId,
      foremanCommision: this.chitData?.foremanCommission,
    };
    this.incrementAuctionCycle()
    this.auctionForm.patchValue(chitDetails);
    this.auctionForm.get('passbookNumber')?.valueChanges.subscribe((passbookNumber) => {
      this.service.findTicketInGroup(this.groupId, passbookNumber).subscribe((res) => {
        if (res.result === true) {
          this.purchase = false
          this.auctionForm.get('passbookNumber')?.setErrors({ ticketExists: true });
        }
        else if (res.inGroup === false) {
          this.auctionForm.get('passbookNumber')?.setErrors({ notExist: true });
        }
        else if (res.purchase === true && this.purchaseChit === true) {
          this.auctionForm.get('passbookNumber')?.setErrors({ alreadyPurchased: true });

        }
        else if (res.purchase === true) {
          this.purchaseId = res.id

          this.purchase = true
        }
        else {
          // Clear the validation error if the ticket does not exist
          this.auctionForm.get('passbookNumber')?.setErrors(null);
          this.purchase = false
        }
        this.fetchSubscriberDetails();
      })
    });
  }

  getRowClass(passbookNumber: number): string {

    this.regId = this.colorCode?.regId
    this.extraId = this.colorCode?.tknTid; // Store the extraId array
    this.purId = this.colorCode?.purId; // Store the purId array
    // Use includes to check membership in the arrays 
    if (this.regId?.includes(passbookNumber)) {
      return 'reg-id-row';
    } else if (this.colorCode?.tknTid?.includes(passbookNumber)) {
      return 'tkn-id-row';
    } else if (this.colorCode?.purId?.includes(passbookNumber)) {
      return 'pur-id-row';
    }
    else if (this.colorCode?.extraTid?.includes(passbookNumber)) {
      return 'extra-id-row';
    }
    else if (this.colorCode?.profitTid?.includes(passbookNumber)) {
      return 'profit-id-row';
    }
    else {
      return '';
    }
  }


  // amountLessThanOrEqualChitAmount(ticketIdControl: string) {
  //   return (formGroup: AbstractControl): ValidationErrors | null => {
  //     const ticketId = formGroup.get(ticketIdControl)?.value;

  //     const maxLen = 20
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
  getRouteNameValue() {
    const winningBid = this.auctionForm.get('winningBid').value;
    const prizedAmount = `${this.chitData.chitAmount - winningBid}`
    this.auctionForm.get('prizedAmount').patchValue(prizedAmount)

    const finalprizedAmount = this.auctionForm.get('prizedAmount').value;
    const walletBalance = this.chitSubscriberTotal
    if (this.regular  || this.tknCompany) {
      // const sumOfTwo = Number(finalprizedAmount) + Number(this.chitData.foremanCommission);
      const finalWallet =Number( this.chitSubscriberTotal) +Number (winningBid)
      this.auctionForm.get('walletBalance').patchValue(finalWallet)

    }else if(this.profitChit){
      const prizedAm = this.chitData.chitAmount - winningBid

      const finalWallet = this.chitSubscriberTotal -prizedAm
      this.auctionForm.get('walletBalance').patchValue(finalWallet)

    }
  }

  onAuctionTypeChange(event: any) {
    const selectedValue = event.target.value;

    this.auctionForm.patchValue({
      subscriberName: '',
      passbookNumber: 'PB-',
      // auctionStart: false,  // or whatever the default value is
      winningBid: '',
      prizedAmount: ''
    });

    this.regular = false;
    this.profitChit = false;
    this.extraPayments = false;
    this.purchaseChit = false;
    this.tknCompany = false;

    switch (selectedValue) {
      case 'regularChit':
        this.regular = true;
        this.profitChit = false
        this.purchaseChit = false
        this.extraPayments = false
        this.tknCompany = false
        break;
      case 'profitChit':
        this.profitChit = true;
        this.regular = false
        this.purchaseChit = false
        this.extraPayments = false
        this.tknCompany = false
        break;
      case 'purchase':
        this.purchaseChit = true;
        this.regular = false
        this.extraPayments = false
        this.tknCompany = false
        this.profitChit = false
        this.service.getTicketId(this.chitData.chitGroupId).subscribe((res) => {
          if (this.purchaseChit) {
            this.auctionForm.get('amountOutstanding').patchValue(res.totalPrizedAmount)
          }
        })
        break;
      case 'tknCompany':
        this.tknCompany = true;
        this.regular = false
        this.purchaseChit = false
        this.profitChit = false
        this.extraPayments = false
        break;
      case 'extraPayments':
        this.extraPayments = true;
        this.regular = false
        this.purchaseChit = false
        this.profitChit = false
        this.tknCompany = false

        break;
      default:

        break;
    }

    // Optional: You can set auctionStart to true if needed
    // this.auctionStart = true;
  }


  fetchSubscriberDetails(): void {
    const passbookNumber = this.auctionForm.get('passbookNumber')?.value;
    const groupId = this.groupId;

    if (passbookNumber && groupId) {
      this.service.getByPassbooNo(passbookNumber).subscribe((details: SubscriberDetails) => {
        this.subDetails = details

        this.auctionForm.patchValue({
          subscriberName: `${this.subDetails.subscriberDetails.firstName} ${this.subDetails.subscriberDetails.aliasName}`,
          // passbookNumber: this.subDetails.chitDetails.passbookNo,
        });
      });
    }
  }
  validateNumber(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  incrementAuctionCycle(): void {
    const groupId = this.chitData?.chitGroupId;

    if (groupId) {
      this.service.getTicketId(groupId).subscribe((data) => {
        const cycle = data
        this.auctionCycle = data.auctionCycle
        this.auctionForm.patchValue({
          auctionCycle: `${cycle?.auctionCycle + 1}`
        })
      })
    }
  }

  toggleFormControls(): void {
    const auctionStart = this.auctionForm.get('auctionStart')?.value;
    const passbookInput = document.getElementById('passbookNumber') as HTMLInputElement;
    const prizedAmountInput = document.getElementById('winningBid') as HTMLInputElement;
    const auctionTypeSelect = document.getElementById('auctionType') as HTMLInputElement;

    if (auctionStart) {
      this.auctionForm.enable();
      this.auctionStart = false
      this.auctionForm.patchValue({
        passbookNumber: 'PB-'
      })
      passbookInput?.removeAttribute('readonly');
      prizedAmountInput?.removeAttribute('readonly');
      this.auctionForm.get('auctionType')?.enable();

    } else {
      passbookInput?.setAttribute('readonly', 'true');
      prizedAmountInput?.setAttribute('readonly', 'true');
      auctionTypeSelect?.setAttribute('readonly', 'true');
      this.auctionForm.get('auctionType')?.disable();

      this.auctionForm.get('auctionStart')?.enable();
      this.auctionStart = true

    }
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.updatedChanges()

    if (this.activeTab === 'extra') {
      this.breadcrumsData = [
        {
          key: 'Chit Management',
          routerLink: '/chit',
        },
        {
          key: `${this.groupId}`,
          routerLink: `chit/view/${this.objId}`,
        },
        {
          key: `Purchase/Extra Payments Details`,
          routerLink: `/chit/auction/${this.objId}`,
        },
      ];
    } else if (this.activeTab === 'tkn') {
      this.breadcrumsData = [
        {
          key: 'Chit Management',
          routerLink: '/chit',
        },
        {
          key: `${this.groupId}`,
          routerLink: `chit/view/${this.objId}`,
        },
        {
          key: `TKN Company Redeem`,
          routerLink: `/chit/auction/${this.objId}`,
        },
      ];
    } else {
      this.breadcrumsData = [
        {
          key: 'Chit Management',
          routerLink: '/chit',
        },
        {
          key: `${this.groupId}`,
          routerLink: `chit/view/${this.objId}`,
        },
        {
          key: `Auction Entry`,
          routerLink: `/chit/auction/${this.objId}`,
        },
      ];
    }
  }

  onSubmit() {

    if (this.regular) {
      payload = {
        groupId: this.auctionForm.value.groupId,
        walletBalance: this.auctionForm.value.walletBalance,
        auctionCycle: this.auctionForm.value.auctionCycle,
        foremanCommision: this.auctionForm.value.foremanCommision,
        winningBid: this.auctionForm.value.winningBid,
        prizedAmount: this.auctionForm.value.prizedAmount,
        date: this.auctionForm.value.date,
        type: "Regular Chit",
        // ticketId:this.auctionForm.value.ticketId,
        location: this.subDetails.subscriberDetails.place,
        occupation: this.subDetails.subscriberDetails.occupation,
        subscriberName: this.auctionForm.value.subscriberName,
        passbookNumber: this.auctionForm.value.passbookNumber,

      }
      var payload = this.auctionForm.value
      payload.occpation = this.subDetails.subscriberDetails.occupation

      payload.location = this.subDetails.subscriberDetails.place
    } else if (this.profitChit) {
      payload = {
        groupId: this.auctionForm.value.groupId,
        walletBalance: this.auctionForm.value.walletBalance,
        auctionCycle: this.auctionForm.value.auctionCycle,
        date: this.auctionForm.value.date,

        profitChitData: {
          foremanCommision: this.auctionForm.value.foremanCommision,
          winningBid: this.auctionForm.value.winningBid,
          prizedAmount: this.auctionForm.value.prizedAmount,
          walletBalance: this.auctionForm.value.walletBalance,
          date: this.auctionForm.value.date,
          type: "Profit Chit",
          occupation: this.subDetails.subscriberDetails.occupation,
          location: this.subDetails.subscriberDetails.place,
          auctionCycle: this.auctionForm.value.auctionCycle,
          subscriberName: this.auctionForm.value.subscriberName,
          passbookNumber: this.auctionForm.value.passbookNumber,
        },
      }
    } else if (this.purchaseChit) {
      payload = {
        groupId: this.auctionForm.value.groupId,
        walletBalance: this.auctionForm.value.walletBalance,
        date: this.auctionForm.value.date,

        purchaseChitData: {
          foremanCommision: this.auctionForm.value.foremanCommision,
          winningBid: this.auctionForm.value.winningBid,
          prizedAmount: this.auctionForm.value.prizedAmount,
          type: "Purchase",
          occupation: this.subDetails.subscriberDetails.occupation,
          location: this.subDetails.subscriberDetails.place,
          auctionCycle: this.auctionForm.value.auctionCycle,
          walletBalance: this.auctionForm.value.walletBalance,
          date: this.auctionForm.value.date,
          subscriberName: this.auctionForm.value.subscriberName,
          passbookNumber: this.auctionForm.value.passbookNumber,
          amountOutstanding: this.auctionForm.value.amountOutstanding
        },
      }
    } else if (this.extraPayments) {
      payload = {
        groupId: this.auctionForm.value.groupId,
        walletBalance: this.auctionForm.value.walletBalance,
        date: this.auctionForm.value.date,

        extraPaymentData: {
          foremanCommision: this.auctionForm.value.foremanCommision,
          winningBid: this.auctionForm.value.winningBid,
          prizedAmount: this.auctionForm.value.prizedAmount,
          subscriberName: this.auctionForm.value.subscriberName,
          auctionCycle: this.auctionForm.value.auctionCycle,
          occupation: this.subDetails.subscriberDetails.occupation,
          location: this.subDetails.subscriberDetails.place,
          walletBalance: this.auctionForm.value.walletBalance,
          date: this.auctionForm.value.date,
          type: "Extra Payments",
          passbookNumber: this.auctionForm.value.passbookNumber,
        },
      }
    } else if (this.tknCompany) {

      payload = {
        groupId: this.auctionForm.value.groupId,
        walletBalance: this.auctionForm.value.walletBalance,
        auctionCycle: this.auctionForm.value.auctionCycle,
        date: this.auctionForm.value.date,

        TKNData: {
          foremanCommision: this.auctionForm.value.foremanCommision,
          winningBid: this.auctionForm.value.winningBid,
          prizedAmount: this.auctionForm.value.prizedAmount,
          tknWallet: this.auctionForm.value.prizedAmount,
          isActive: this.auctionForm.value.isActive,
          type: "TKN Company",
          auctionCycle: this.auctionForm.value.auctionCycle,
          walletBalance: this.auctionForm.value.walletBalance,
          date: this.auctionForm.value.date,
          redeem: false
        },
      }
    } else {
      payload = ""
    }
    this.service.saveAuctionDetails(payload).subscribe((response: any) => {
      this.auctionData = response.data;
      this.isSubmitted = true;
      if (this.purchase == true) {
        this.service.deleteAuction(this.purchaseId).subscribe((res) => {
        })
      }
      
      const nextMonth = this.getNextMonthSameDate(response.data.date)
      if (this.regular || this.tknCompany) {
        // if (response.data.auctionCycle == 19) {
        //   nextWallet = this.chitData.chitAmount - response.data.walletBalance
        // } else if (response.data.auctionCycle >= 20) {
        //   nextWallet = 0
        // }
        // else {
        //   nextWallet = this.chitData.chitAmount
        // }

        var nextWallet =Number (this.auctionForm.value.winningBid)-Number(this.auctionForm.value.foremanCommision)
        console.log(Number (this.auctionForm.value.winningBid));
        
        this.paymentService.saveTransactionDetails(response.data.groupId, +nextWallet).subscribe(
          (response) => {
          })
        }else if(this.profitChit){
          const profitPrized=this.auctionForm.value.prizedAmount
          this.paymentService.saveTransactionDetails(response.data.groupId, -profitPrized).subscribe(
        (response) => {
         })
        }
      // this.ticketId=this.auctionData.ticketId
      const createdAtDate = new Date(response.data.createdAt);
      this.date = createdAtDate.toISOString().split('T')[0]; // Formats the date
      this.time = createdAtDate.toLocaleTimeString();  // Formats the time
      this.month = createdAtDate.toLocaleString('default', { month: 'long' });  // Full month name
      this.year = createdAtDate.getFullYear();  // Year
      var walletBalance = 0
      if (this.regular) {
        walletBalance = response.data.prizedAmount + response.data.foremanCommision
        this.receipt = {
          time: this.time,
          date: this.datePipe.transform(response.data.date, 'dd-MM-yyyy') || '',
          type: "Regular Chit",
          prizedAmount: response.data.prizedAmount,
          subscriberName: response.data.subscriberName,
          occupation: response.data.occupation,
          location: response.data.location,
          groupId: response.data.groupId,
          passbookNo: response.data.passbookNumber,
          foremanCommision: response.data.foremanCommision,
          walletBalance: response.data.walletBalance,
          auctionCycle: response.data.auctionCycle,
          winningBid: response.data.winningBid
        }
      } else if (this.profitChit) {
        walletBalance = response.data.profitChitData.prizedAmount + response.data.profitChitData.foremanCommision
        this.receipt = {
          time: this.time,
          type: "Profit Chit",
          prizedAmount: response.data.profitChitData.prizedAmount,
          subscriberName: response.data.profitChitData.subscriberName,
          groupId: response.data.groupId,
          date: this.datePipe.transform(response.data.profitChitData.date, 'dd-MM-yyyy') || '',
          occupation: response.data.profitChitData.occupation,
          location: response.data.profitChitData.location,
          passbookNo: response.data.profitChitData.passbookNumber,
          winningBid: response.data.profitChitData.winningBid,
          auctionCycle: response.data.profitChitData.auctionCycle,
          foremanCommision: response.data.profitChitData.foremanCommision,
        }
      } else if (this.purchaseChit) {
        walletBalance = 0
        this.receipt = {
          time: this.time,
          date: this.datePipe.transform(response.data.purchaseChitData.date, 'dd-MM-yyyy') || '',
          type: "Purchase",
          prizedAmount: response.data.purchaseChitData.prizedAmount,
          subscriberName: response.data.purchaseChitData.subscriberName,
          groupId: response.data.groupId,
          occupation: response.data.purchaseChitData.occupation,
          location: response.data.purchaseChitData.location,
          passbookNo: response.data.purchaseChitData.passbookNumber,
          winningBid: response.data.purchaseChitData.winningBid,
          auctionCycle: response.data.purchaseChitData.auctionCycle,
          foremanCommision: response.data.purchaseChitData.foremanCommision,

        }
      } else if (this.extraPayments) {
        walletBalance = 0
        this.receipt = {
          time: this.time,
          type: "Extra Payments",
          date: this.datePipe.transform(response.data.extraPaymentData.date, 'dd-MM-yyyy') || '',
          prizedAmount: response.data.extraPaymentData.prizedAmount,
          subscriberName: response.data.extraPaymentData.subscriberName,
          groupId: response.data.groupId,
          occupation: response.data.extraPaymentData.occupation,
          location: response.data.extraPaymentData.location,
          passbookNo: response.data.extraPaymentData.passbookNumber,
          winningBid: response.data.extraPaymentData.winningBid,
          auctionCycle: response.data.extraPaymentData.auctionCycle,
          foremanCommision: response.data.extraPaymentData.foremanCommision,

        }
      } else if (this.tknCompany) {
        walletBalance = response.data.TKNData.prizedAmount + response.data.TKNData.foremanCommision
        this.service.getTicketId(this.chitData.chitGroupId).subscribe((res) => {
          this.bidHistory = res.allData
          this.regularFirst = this.bidHistory?.length

          const firstAuction = this.bidHistory?.length || 0;
          this.regularFirst = firstAuction === 0;


          this.bidHistory = res.allData.map((history, index) => ({
            sNo: index + 1, // Use the index parameter and add 1 for serial number
            passbookNumber: history.passbookNumber,
            subscriberName: history.subscriberName,
            location: history.location,
            walletBalance: history.walletBalance,
            month: this.convertDateToMonth(history.date), // Convert the date to the month
            winningBid: history.winningBid,
            prizedAmount: history.prizedAmount,
            viewDetails: "View Details"
          }));

        });
        this.receipt = {
          time: this.time,
          type: "Tkn Company",
          prizedAmount: response.data.TKNData.prizedAmount,
          // subscriberName:response.data.TKNData.subscriberName,
          groupId: response.data.groupId,
          date: this.datePipe.transform(response.data.TKNData.date, 'dd-MM-yyyy') || '',
          // passbookNo:response.data.TKNData.passbookNumber,
          winningBid: response.data.TKNData.winningBid,
          auctionCycle: response.data.TKNData.auctionCycle,
          foremanCommision: response.data.TKNData.foremanCommision,
        }
      } else {
        this.receipt = ""
      }


          this.purchase = false
          // this.auctionForm.reset()
          this.incrementAuctionCycle()

          this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
            this.walletBalance = response
            this.walletBalance = this.walletBalance.payment
            this.walletBalance.forEach(amount => {
              this.chitSubscriberTotal = amount.walletBalance
              this.auctionForm.patchValue({
                walletBalance: this.chitSubscriberTotal
              })
            });
          // })
          this.auctionStart = false
          this.regularFirst = false
          this.noReg = false
          this.tknMonth = false
          this.auctionForm.patchValue({
            auctionType: "",
            subscriberName: '',
            passbookNumber: 'PB-',
            auctionStart: false,  // or whatever the default value is
            winningBid: '',
            prizedAmount: ''

          });
          setTimeout(() => {
            this.updatedChanges()

            this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
              this.walletBalance = response;
              this.walletBalance = this.walletBalance.payment;

              this.walletBalance.forEach((amount) => {
                this.chitSubscriberTotal = amount.walletBalance;

                // Update the form with the wallet balance
                this.auctionForm.patchValue({
                  walletBalance: this.chitSubscriberTotal
                });
              });
            });
          }, 10  * 60 * 1000); // 3 minutes = 180,000 milliseconds

          this.updatedChanges()


          this.openModal()


          this.auctionForm.disable();
          this.auctionForm.get('auctionStart')?.enable();

        }
      )
    });
    // this.auctionForm.reset()
  }

  getNextMonthSameDate(createdAt: Date): Date {
    // Parse the createdAt date
    const date = new Date(createdAt);

    // Get current year and month
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth(); // 0-based (0 = January, 11 = December)

    // Calculate the next month and year
    let nextMonth = currentMonth + 1; // Increment month
    let nextYear = currentYear;

    if (nextMonth > 11) {
      // If the current month is December, wrap to January and increment the year
      nextMonth = 0;
      nextYear += 1;
    }

    // Set the next month and handle date overflow (e.g., 31st in a month that doesn't have 31 days)
    const nextMonthDate = new Date(nextYear, nextMonth, date.getDate());

    // If the next month doesn't have the same date (e.g., February 30th), adjust to the last valid date
    if (nextMonthDate.getMonth() !== nextMonth) {
      nextMonthDate.setDate(0); // Set to the last day of the previous month
    }

    // Return the date as an ISO string or any desired format
    return nextMonthDate
  }

  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    // const ticketId = params.data.ticketId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="30" height="30" style="border-radius: 50%; margin-right: 10px;">

      </div>
    `;
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

    // Replace body content with modal content
    document.body.innerHTML = printContent;

    // Trigger print
    window.print();

    // Revert body content
    document.body.innerHTML = originalContent;
  }


  cancel() {
    this.activatedRoute.params.subscribe(paramData => {
      this.router.navigate([`chit/view/${paramData.id}`]);

    })
  }

  openModal() {
    this.isModalOpen = true;
  }

  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  createInvoice() {
    this.invoiceClick = true
    this.closeModel()
  }
  closeInvoice() {
    this.invoiceClick = false
    this.chitDetail = {}
    this.datas = {}

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

  confirm() {
    this.isConfirmationModalOpen = false;
    this.invoiceGen = false
  }

  showModal(): void {
    this.showDetails = true
  }

  closeModel() {
    this.showDetails = false
  }
  column: ITableColumn[] = [
    { field: 'sNo', label: 'Serial No' },
    { field: 'passbookNumber', label: 'Passbook No' },
    { field: 'subscriberName', label: 'Name', sortable: false, filter: false },
    // { field: '', sortable: false, filter: false },
    { field: 'location', label: "Location", sortable: false, filter: false },
    { field: 'month', label: 'Month' },
    { field: 'walletBalance', label: 'Wallet Balance' },
    // { field: 'occupation', label:"Occupation" ,sortable: false, filter: false },
    { field: 'winningBid', label: "WinningBid", sortable: false, filter: false },
    { field: 'prizedAmount', label: "Prized Amount", sortable: false, filter: false },

    {
      field: 'viewDetails', label: "'View Details'", sortable: false, filter: false,
      cellStyle: function (params: any) {
        return { color: '#50A1A5', cursor: 'pointer' };
      },
      onCellClicked: (event: CellClickedEvent) =>

        this.getDataById(event.data.passbookNumber)
    },

  ];


  printDetails() {
    const printContent = document.getElementById('download-section').innerHTML;
    const originalContent = document.body.innerHTML;

    // Replace body content with modal content
    document.body.innerHTML = printContent;

    // Trigger print
    window.print();

    // Revert body content
    document.body.innerHTML = originalContent;

  }
  download() {
    const element = document.getElementById('download-section');

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

      pdf.save(`${this.chitDetail.subscriberName}.pdf`);
      element.style.width = '';
    });
  }
}
