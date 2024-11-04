import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
import { Router, ActivatedRoute } from '@angular/router';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { Subscriber } from 'rxjs';
import { ServiceService } from '../../settings/shared/service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-chit-view',
  templateUrl: './chit-view.component.html',
  styleUrl: './chit-view.component.css'
})
export class ChitViewComponent implements OnInit {
  data: any[] = [];
  length: boolean
  subscribers: any[] = []
  addSubscribers: any[] = []
  chitData: any;
  breadcrumsData: any = [];
  chitId: string = "";
  payment: any
  totalChitData: any;
  groupId: string;
  walletBalance: any
  chitSubscriberTotal = 0;
  addSubscriberTotal = 0;
  canCreate: boolean = false;
  showChitDetails: any;
  chitDetail: any;
  itemsPerPage = 10; // Subscribers per page
  specificChitData: any;
  showTicket: boolean = false;
  ticketDetail: any;
  filteredSubscribers: any;
  filteredAdditionalSubs: any;
  isSubscriberListVisible: boolean = false;
  displayedSubscribers: any[];
  subscriberData: any = {}
  selectedSubscriberId: string
  listId: any
  subscriberDetail: any;
  currentListType: 'chit' | 'additional' = 'chit';
  modalErrorMessage: string = '';
  addSubData: any = {}
  subData: any = {}
  viewSubscriber: any;
  bidHistory: any[] = [];
  filteredHistory: any;
  showBidHistory: boolean = false;
  displayedChit: any[] = []
  prizedSubsCount: number = 0;
  countProfitChitData: number = 0;
  sumTKNDataWalletBalance: number = 0;
  sumPrizedAmount: number = 0;
  showAdditionalGrid: boolean;
  showAddSubButton: boolean;
  addPayment: any
  collectionTypeForm: FormGroup
  collectionTypes: any;
  showall = false; // To toggle "View More"
  showGroups = false
  showDetails:boolean=false
  chitDetails:any
  datas:any
  recDate:String
  recTime:String
  prizedSub:number
  amountOutstanding:any
  auctionCycle:number
  profitCount:any
  tknAmount:number
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: ChitService, private paymentService: PaymentService, private authService: AuthService, private subservice: SubscriberService, private settings: ServiceService) { }
column: ITableColumn[] = [
  { field: 'passbookNumber', label: 'Passbook No' },
  { field: 'subscriberName',  label: 'Name' ,sortable: false, filter: false },
  // { field: '', sortable: false, filter: false },

  { field: 'location', label:"Location" ,sortable: false, filter: false },
  // { field: 'occupation', label:"Occupation" ,sortable: false, filter: false },
  { field: 'winningBid',  label:"WinningBid",sortable: false, filter: false },
  { field: 'viewDetails',  label:"'View Details'",sortable: false, filter: false ,
    cellStyle: function (params: any) {
      return { color: '#50A1A5' ,cursor:'pointer'};
    },
    onCellClicked: (event: CellClickedEvent) =>
  
      this.getDataById(event.data.passbookNumber)
  

  },

];
  getAllChit() {
    this.service.getAllChit().subscribe((data) => {
      this.totalChitData = data;
      this.totalChitData = this.totalChitData?.AllChitGroups
      this.displayedChit = this.totalChitData
      this.displayedChit = this.totalChitData.slice(0, 5);
    })
  }

  ngOnInit(): void {
    this.getAllChit()
    this.getAllAuction()
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate = true
      }
    })
    this.collectionTypeForm = new FormGroup({
      collectionType: new FormControl('', [Validators.required]),
    });


    this.activatedRoute?.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
        this.service.getChitById(paramData.id).subscribe((data) => {
          this.chitData = data;
          this.chitData = this.chitData.ChitsGroup;
          this.groupId = this.chitData.chitGroupId;

          this.service.getTicketId(this.groupId).subscribe((res) => {
            this.amountOutstanding=res.totalPrizedAmount
            this.profitCount=res.profitCount
            this.tknAmount=res.totalTknCompany
            this.bidHistory=res.allData
            this.auctionCycle=res.auctionCycle-1
            console.log(this.bidHistory?.length);
            this.prizedSub=this.bidHistory?.length
            this.bidHistory=  res.allData.map(history=>({
              passbookNumber:history.passbookNumber,
              subscriberName:history.subscriberName,
              location:history.location,
              // occupation:history.occupation,
              winningBid:history.winningBid,
              prizedAmount:history.prizedAmount,
              viewDetails:"View Details"
            }))
             });
      
          
          if (this.chitData.addChitSubscribers && this.chitData.addChitSubscribers.length > 0) {
            const lastSubscriber = this.chitData.addChitSubscribers[this.chitData.addChitSubscribers.length - 1];

          } else {
          }
          this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
            this.payment = response
            this.payment = this.payment.payment
            this.payment.forEach(amount => {
              this.chitSubscriberTotal = amount.walletBalance
            });
          })

          this.paymentService.getAddWallet(this.groupId).subscribe((response) => {
            this.addPayment = response
            this.addPayment = this.addPayment.payment
            this.addPayment.forEach(amount => {
              this.addSubscriberTotal = amount.addWalletBalance
            });
          })
          this.breadcrumsData = [
            {
              key: 'Chit Management',
              routerLink: '/chit',
            },

            {
              key: `${this.chitData.chitGroupId}`,
              routerLink: `chit/view/${paramData.id}`,
            },
          ];
          this.subscribers = this.chitData.chitSubscribers;
          this.addSubscribers = this.chitData.addChitSubscribers;
        });
      }
    });


  }

  getDataById(id:any){
    console.log(id)
    this.service.getSubAuction(id).subscribe(
      data => {
        console.log("e354");
        
        if(data.subscriberAuc.extraPaymentData){
        this.chitDetail = data.subscriberAuc.extraPaymentData;
        }else if(data.subscriberAuc.profitChitData){
          this.chitDetail = data.subscriberAuc.profitChitData;
        }else if(data.subscriberAuc.purchaseChitData){
          this.chitDetail = data.subscriberAuc.purchaseChitData;
        } else if(data.subscriberAuc.TKNData){
          this.chitDetail = data.subscriberAuc.TKNData;
        }else{
          this.chitDetail = data.subscriberAuc;

        }
        this.showDetails=true
        this.datas=data.subscriberAuc;

        this.showDetail()
      const createdAtDate = new Date(this.datas.createdAt);
      this.recDate =createdAtDate.toISOString().split('T')[0]; // Formats the date
      this.recTime = createdAtDate.toLocaleTimeString();  // Formats the time
        console.log(this.datas)
        console.log(this.chitDetail)
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
  
  }
  showDetail(): void {
    this.showDetails=true
  }
  closeModel(){
    this.showDetails=false
    this.chitDetail={}
    this.datas={}
  }
  viewMore(): void {
    if (!this.showall) {
      this.displayedSubscribers = this.data; // Show all subscribers
      this.showall = true;
    }
  }

  viewMore1(): void {
    if (!this.showGroups) {
      this.displayedChit = this.totalChitData; // Show all subscribers
      this.showGroups = true;
    }
  }

  viewless1(): void {
    if (this.showGroups) {
      this.displayedChit = this.totalChitData.slice(0, 5);
      this.showGroups = false;
    }
  }
  formatToIndianCurrency(amount: number | string): string {
    if (!amount) return '';

    let amountStr = amount.toString();
    const isNegative = amountStr.startsWith('-');
    if (isNegative) {
      amountStr = amountStr.slice(1);
    }

    let [integer, decimal] = amountStr.split('.');

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\d+)(?=(\d{2})+(\d{3})(?!\d))/g, '$1,');
    const formattedAmount = decimal ? `${integer}.${decimal}` : integer;
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  }

  closeTicket(type: 'close') {
    this.showTicket = false;
  }

  showSubscriberList(): void {

    this.isSubscriberListVisible = true;
    this.subservice.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      this.data = this.subscriberData.AllSubscriber.map((subscriberDetails, index) => ({
        id: subscriberDetails?._id,
        subscriberId: subscriberDetails?.subscriberId,
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
        subscriberProfile: subscriberDetails?.profileImageUrl
      }))
      this.displayedSubscribers = this.data.slice(0, this.itemsPerPage);
    })
  }

  onButtonClick(id: string): void {
    this.getSubscribersById(id);
    this.listId = id
    this.collectionTypeForm.reset()
    this.settings.getAllCollection().subscribe(
      (data) => {
        this.collectionTypes = data
        this.collectionTypes = this.collectionTypes.res
      }
    )
    if (this.subscriberDetail && this.subscriberDetail.id === id) {
      // If the same subscriber is clicked, toggle off the details
      this.subscriberDetail = null;
    } else {
      this.subscriberDetail = this.displayedSubscribers.find(sub => sub.id === id);
    }
  }

  getSubscribersById(id: string): void {
    this.subservice.getsubscriberById(id).subscribe(
      data => {
        this.subscriberDetail = data;
        this.selectedSubscriberId = this.subscriberDetail.Subscriber.subscriberId;
      },
      error => {
      }
    );
  }

  applyFilter(filterValue: string) {
    const filteredSubscribers = this.data.filter(subscriber => {
      const subscriberId = subscriber.subscriberId?.toString().toLowerCase() || '';
      const subscriberName = subscriber.subscriberName?.toLowerCase() || '';
      const email = subscriber.email?.toLowerCase() || '';
      return subscriberId.includes(filterValue.toLowerCase()) ||
        subscriberName.includes(filterValue.toLowerCase()) ||
        email.includes(filterValue.toLowerCase());
    });
    this.displayedSubscribers = filteredSubscribers.slice(0, this.itemsPerPage);

  }

  applyFilterchit(filterValue: string) {
    this.displayedChit = this.totalChitData;
    if (!filterValue || !this.data) {
      return;
    }

    this.displayedChit = this.totalChitData.filter(subscriber => {
      const groupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
      return groupId.includes(filterValue.toLowerCase());
    });
  }

  addSelectedSubscriber(subscriber: any): void {

    if (this.listId == subscriber) {
      if (this.currentListType === 'chit') {
        this.addSubscriberById(subscriber);
      } else {
        this.addAdditionalSubscriberById(subscriber);

      }
      this.subscriberDetail = null;
    }
  }

  addSubscriberById(id: string): void {
    const chitSubscribers = this.chitData.chitSubscribers || [];
    if (chitSubscribers.length >= 25) {
      this.showModal('Cannot add more than 25 subscribers.');
      return;
    }

    this.subservice.getsubscriberById(id).subscribe(
      res => {
        this.subData = res;

        const newSubscriber = {
          subscriberId: this.subData.Subscriber.subscriberId,
          profileImageUrl: this.subData.Subscriber.profileImageUrl,
          aliasName: this.subData.Subscriber.lastName,
          firstName: this.subData.Subscriber.firstName,
          place: this.subData.Subscriber.routeId,
          occupation: this.subData.Subscriber.occupation,
          collectionType: this.collectionTypeForm.get('collectionType')?.value
        };

        if (chitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId)) {
          this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
          return;
        }
        chitSubscribers.push(newSubscriber);
        this.subscribers = [...chitSubscribers];
        this.service.addSubscriber(this.groupId, newSubscriber).subscribe(data => {
          this.activatedRoute?.params.subscribe(paramData => {
            if (Object.keys(paramData).length) {
              this.service.getChitById(paramData.id).subscribe((data) => {
                this.chitData = data;
                this.chitData = this.chitData.ChitsGroup;
                this.subscribers = this.chitData.chitSubscribers;

              })
            }

          })
        })
        this.subscribers = [...chitSubscribers];
        if (this.subscribers.length >= 25) {
          this.isSubscriberListVisible = false;
        }
      },
      error => {
        if (error.status === 400 && error.error.message.includes('Duplicate subscriberId')) {
          this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
        } else {
        }
      }
    );

  }

  addAdditionalSubscriberById(id: string): void {

    const addChitSubscribers = this.chitData.addChitSubscribers || [];
    const chitSubscribers = this.chitData.chitSubscribers || [];

    if (addChitSubscribers.length >= 5) {
      this.showModal('Cannot add more than 5 additional subscribers.');
      return;
    }

    this.subservice.getsubscriberById(id).subscribe(
      res => {
        this.addSubData = res;
        const newSubscriber = {
          subscriberId: this.addSubData.Subscriber.subscriberId,
          profileImageUrl: this.addSubData.Subscriber.profileImageUrl,
          aliasName: this.addSubData.Subscriber.lastName,
          firstName: this.addSubData.Subscriber.firstName,
          place: this.addSubData.Subscriber.routeId,
          occupation: this.addSubData.Subscriber.occupation
        };

        // Check for duplicate subscriber ID in both addChitSubscribers and chitSubscribers
        if (
          addChitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId) ||
          chitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId)
        ) {
          this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
          return;
        }
        addChitSubscribers.push(newSubscriber);

        // Update the table data for additional subscribers
        this.addSubscribers = [...addChitSubscribers];
      },
      error => {
      }
    );
  }

  // Method to show modal (assuming you have a modal implementation)
  showModal(message: string): void {
    this.modalErrorMessage = message;
    const modal = document.getElementById('duplicateModal');
    modal.style.display = 'block';
  }

  // Method to close modal
  closeModal(): void {
    const modal = document.getElementById('duplicateModal');
    modal.style.display = 'none';
  }

  removeSubscriber(subId: string) {
    let chitgroupId = this.chitData.chitGroupId

    this.service.deleteSubscriber(chitgroupId, subId).subscribe((res) => {

    })

    this.activatedRoute?.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
        this.service.getChitById(paramData.id).subscribe((data) => {
          this.chitData = data;
          this.chitData = this.chitData.ChitsGroup;
          this.subscribers = this.chitData.chitSubscribers;

        })
      }

    })
  }

  getAllAuction() {
    this.service.getAllChitAuction().subscribe((res) => {
    })
  }

  // getAuctionById(id: string) {
  //   this.service.getChitAuctionById(id).subscribe((res) => {
  //     this.bidHistory = res.data;
  //     this.bidHistory = this.bidHistory.map(data => {
  //       // Initialize base fields from top level
  //       const result = {
  //         auctionCycle: data.auctionCycle || data.TKNData?.auctionCycle || 'N/A',
  //         subscriberName: data.subscriberName || data.extraPaymentData?.subscriberName || data.TKNData?.subscriberName || data.profitChitData?.subscriberName || data.purchaseChitData?.subscriberName || 'N/A',
  //         winningBid: data.winningBid || data.extraPaymentData?.winningBid || data.TKNData?.winningBid || data.profitChitData?.winningBid || data.purchaseChitData?.winningBid || 'N/A',
  //         prizedAmount: data.prizedAmount || data.extraPaymentData?.prizedAmount || data.TKNData?.prizedAmount || data.profitChitData?.prizedAmount || data.purchaseChitData?.prizedAmount || 'N/A',
  //         walletBalance: data.walletBalance
  //       };
  //       return result;
  //     });
  //   })
  // }

  openBidHistory(groupId: string) {
    this.showBidHistory = !this.showBidHistory
    if (this.showBidHistory) {
      // this.getAuctionById(groupId)
    }
  }

  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    // const ticketId = params.data.ticketId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="30" height="30" style="border-radius: 50%; margin-right: 10px;">
        <span style="color: #50A1A5;"></span>
      </div>
    `;
  }

  navigate(id: any) {
    this.router.navigate([`chit/view/${id}`]);
  }

  auctionEntry(id: any) {
    this.router.navigate([`chit/auction/${id}`])
  }

  getChitById(id: string) {
    this.showTicket = true;
    this.filteredSubscribers = this.subscribers.filter(subscriber => subscriber._id === id);
    // this.filteredAdditionalSubs = this.addSubscribers.filter(subscriber => subscriber._id === id);
    const subscriber = this.filteredSubscribers[0];
    this.collectionTypeForm.patchValue({
      collectionType: subscriber.collectionType  // Patch the collectionType value from the filtered subscriber
    });
    this.settings.getAllCollection().subscribe(
      (data) => {
        this.collectionTypes = data
        this.collectionTypes = this.collectionTypes.res
      }
    )
    return this.filteredSubscribers;

  }



  subscriberColumn: ITableColumn[] = [
    {
      label: 'profileImageUrl',
      field: ' ',
      filter: false,
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id)
    }, { label: 'Name', field: 'firstName', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
    { label: 'Alias Name', field: 'aliasName', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
    { label: 'Passbook Number', field: 'passbookNo', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
    { label: 'Place', field: 'place', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
    { label: 'Occupation', field: 'occupation', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
    { label: 'Collection Type', field: 'collectionType', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },

  ];


  DummyData = [
    {
      label: 'Auction No', field: 'auctionCycle'
    },
    {
      label: 'Prized Subscriber', field: 'subscriberName'
    },
    {
      label: 'Winning Bid ', field: 'winningBid'
    },
    {
      label: 'Prized Amount ', field: 'prizedAmount'
    }
  ]
  edit(passbookNo: string) {
    this.service.getByPassbooNo(passbookNo).subscribe((data: any) => {
      const editSubscriber = data;
      editSubscriber.subscriberDetails.collectionType = this.collectionTypeForm.get('collectionType').value;
      this.service.updateSubscriber(editSubscriber.chitGroupId, passbookNo, editSubscriber.subscriberDetails).subscribe(
        (response: any) => {
          this.showTicket = false;
          this.activatedRoute?.params.subscribe(paramData => {
            if (Object.keys(paramData).length) {
              this.service.getChitById(paramData.id).subscribe((data) => {
                this.chitData = data;
                this.chitData = this.chitData.ChitsGroup;
                this.subscribers = this.chitData.chitSubscribers;

              })
            }

          })
          // You can add code here to handle success, like showing a success message or updating the UI
        },

      );
    });
  }
  isSubscriberInChit(subscriberId: string): boolean {
    return this.subscribers.some(chitSubscriber => chitSubscriber.subscriberId === subscriberId);
  }

  subPage(id:string){
    console.log(id);
    // this.router.navigate([`subscriber/view/${id}`]);

  }
}
