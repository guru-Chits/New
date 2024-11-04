import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChitService } from './shared/service/chit.service';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/service/auth.service';
import { PaymentService } from '../payments/shared/service/payment.service';
import { SubscriberService } from '../subscriber/shared/service/subscriber.service';
@Component({
  selector: 'app-chit',
  templateUrl: './chit.component.html',
  styleUrl: './chit.component.css'
})

export class ChitComponent implements OnInit {
  breadcrumsData: any = [
    {
      key: 'Chit Management',
      routerLink: 'chit',
    },
  ];
  tknAmount:number
  transactions:any
  subCount:number
  totalWalletBalance:number
  auctionCycle:number
  isChitListVisible: boolean = false;
  showChitDetails: boolean = false;
  chitdata: any;
  subscriberData:any
  data: any[] = [];
  displayedChit: any[] = []
  specificChitData: any = {}
  total: any;
  selectedChit: number = 1
  canCreate: boolean = false;
  groupId: string;
  payment: any;
  chitSubscriberTotal = 0;
  bidHistory: any;
  latestWinningBid: number = 0;
  prizedSubsCount: number = 0;
  auctionDates: (string)[] = [];
  upcomingDates: (string | null)[] = [];
  // Pagination properties
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  count: number = 0
  auctions:any
  
  displayedAuctions:any
  chitGroups:any
  showGroups:boolean=false
  constructor(private router: Router, private service: ChitService, private authService: AuthService,private subscriberService:SubscriberService, private paymentService: PaymentService) { }

  ngOnInit(): void {
    // this.incrementMonth();
    // this.filterUpcomingDates();
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate = true
      }
    });

    this.service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups
      
      this.total = this.chitdata.length
      this.displayedChit = this.chitdata;
    
      this.totalPages = Math.ceil(this.displayedChit.length / this.itemsPerPage);
      // this.auctionDates = this.chitdata.map((chit: any) => chit.auctionDate);
      // this.auctionDates = this.auctionDates.map(dateString => {
      //   if (dateString) {
      //     // Parse the date string
      //     const [day, month, year] = dateString.split('-').map(Number);
      //     const date = new Date(year, month - 1, day); // month is zero-based in Date object

      //     // Increment the month by 1
      //     date.setMonth(date.getMonth() + 1);

      //     // Format back to 'DD-MM-YYYY'
      //     const updatedDay = date.getDate().toString().padStart(2, '0');
      //     const updatedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      //     const updatedYear = date.getFullYear();

      //     return `${updatedDay}-${updatedMonth}-${updatedYear}`;
      //   }
      //   return null;
      // });
      // console.log("Auction Dates ->", this.auctionDates);
      // this.groupId=this.chitdata?.AllChitGroups;
      // console.log("GROUP ID", this.groupId)
      // const today = new Date();
      // console.log("TODAY", today)
      // this.upcomingDates = this.auctionDates.filter(dateString => {
      //   if (dateString) {
      //     // Split the date into day, month, and year
      //     const [day, month, year] = dateString.split('-').map(Number);
      //     const date = new Date(year, month - 1, day); // Month is zero-based

      //     // Compare with today's date
      //     return date > today;
      //   }
      //   return false;
      // });

      // console.log('Upcoming Dates ->', this.upcomingDates);

    })

    this.service.getAuctionToday().subscribe((data=>{
      this.auctions=data
      this.auctions=this.auctions.todaysAuction
      this.displayedAuctions=this.auctions.slice(0,5)
      console.log(this.auctions);

    }))


    this.service.getAllAuction().subscribe((response: any) => {
      if (response.success && Array.isArray(response.data)) {
        this.tknAmount = response.data.reduce((sum, item) => {
          return sum + (item.purchaseChitData?.prizedAmount || 0);
        }, 0);
          }
    });

    this.paymentService.getAllTransaction().subscribe((response => {
      // Assuming response is the full response object
      this.transactions = response;
      this.transactions=this.transactions.AllTransaction

      // Sum all wallet balances
      this.totalWalletBalance = this.transactions.reduce((total, transaction) => {
        return total + (transaction.walletBalance || 0); // Add walletBalance or 0 if undefined
      }, 0);
    
    }));
    
    this.subscriberService.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      console.log(this.subscriberData,"Deta");
      
      this.data = this.subscriberData.AllSubscriber.map((subscriberDetails, index) => ( {
        
        enroll: this.subscriberService.getChitGroupById(subscriberDetails?.subscriberId).subscribe(
          response => {
            this.chitGroups = response;
            // Check if the chitGroup length is greater than 1
            if (this.chitGroups.length > 1) {
              // Increment the totalCount
              this.count++;
            }
          }
        )

      }))
    })
  }
  // Move to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Move to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  recieveChildBoolean(event: boolean) {
    this.showChitDetails = event
  }

  applyFilter(filterValue: string) {
    this.displayedChit = this.chitdata;
    if (!filterValue || !this.data) {
      return;
    }

    this.displayedChit = this.chitdata.filter(subscriber => {
      const groupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
      // const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
      return groupId.includes(filterValue.toLowerCase());
    });
  }

  handleChitGropDetails(id: string, index: number) {
    this.showChitDetails = true
    this.selectedChit = index + 1
    this.getChitById(id)
  }
  getChitById(id: string): void {
    this.service.getChitById(id).subscribe(
      (data) => {
        this.specificChitData = data
        this.specificChitData = this.specificChitData.ChitsGroup
        if (this.specificChitData) {
          this.groupId = this.specificChitData.chitGroupId
          this.service.getChitAuctionById(this.groupId).subscribe((res) => {
            // this.bidHistory = res.data;

            
          })

          this.service.getTicketId(this.groupId).subscribe((res) => {

            console.log(res);
              this.subCount=res.allData.length
              this.auctionCycle=res.auctionCycle-1
            this.bidHistory = res.allData;
            
              const len=this.bidHistory?.length-1
              if(len>0){
                const lastItem = this.bidHistory[len];
                this.latestWinningBid = lastItem?.winningBid;
  
              }else{
                this.latestWinningBid = 0;

              }
  
              console.log(this.latestWinningBid,"last");
          })

          this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
            this.payment = response
            this.payment = this.payment.payment
            this.payment.forEach(amount => {
              this.chitSubscriberTotal = amount.walletBalance
            });
          })
          this.getAuctionById(this.groupId)
        }

      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );

  }

  getAllChit() {
    this.service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups
      this.total = this.chitdata.length

    })
  }


  getAuctionById(id: string) {
    this.service.getChitAuctionById(id).subscribe((res) => {
      this.bidHistory = res.data;

      // this.prizedSubsCount = this.bidHistory.filter(item => item.subscriberName).length;
    })
  }


  navigate(id: any) {
    this.router.navigate([`chit/view/${id}`]);
  }

  auctionEntry(id: any) {
    this.router.navigate([`chit/auction/${id}`])
  }

  nav(id:string){
console.log(id);
this.router.navigate([`chit/auction/${id}`])
  }

  viewAll(){
    if (!this.showGroups) {
      this.displayedAuctions = this.auctions; // Show all subscribers
      this.showGroups = true;
    }

  }
  viewLess(){
    if (this.showGroups) {
      this.displayedAuctions = this.auctions.slice(0, 5);
      this.showGroups = false;
    }

  }
}

