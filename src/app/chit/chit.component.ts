import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  tknAmount: number
  transactions: any
  subCount: number
  totalWalletBalance: number
  auctionCycle: number
  isChitListVisible: boolean = false;
  showChitDetails: boolean = false;
  chitdata: any;
  subscriberData: any
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
  // count: number = 0
  auctions: any

  displayedAuctions: any
  chitGroups: any
  showGroups: boolean = false
  constructor(private router: Router, private service: ChitService, private authService: AuthService, private subscriberService: SubscriberService, private paymentService: PaymentService) { }

  ngOnInit(): void {
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
    })
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchChitData();
      }
    });
    
    this.service.getAuctionToday().subscribe((data => {
      this.auctions = data
      this.auctions = this.auctions.todaysAuction
      this.displayedAuctions = this.auctions.slice(0, 5)
    }))


    this.service.getAllAuction().subscribe((response: any) => {
      if (response.success && Array.isArray(response.data)) {
        this.tknAmount = response.data.reduce((sum, item) => {
          return sum + (item.purchaseChitData?.prizedAmount || 0);
        }, 0);
      }
    });

    // this.paymentService.getAllTransaction().subscribe((response => {
    //   // Assuming response is the full response object
    //   this.transactions = response;
    //   this.transactions = this.transactions.AllTransaction

    //   // Sum all wallet balances
    //   this.totalWalletBalance = this.transactions.reduce((total, transaction) => {
    //     return total + (transaction.walletBalance || 0); // Add walletBalance or 0 if undefined
    //   }, 0);

    // }));

    this.paymentService.getAllTransaction().subscribe((response) => {
  // Assuming response is the full response object
  this.transactions = response;
  this.transactions = this.transactions.AllTransaction;

  // Process each transaction and adjust walletBalance based on auction cycle
  this.transactions.forEach((transaction) => {
    this.service.getTicketId(transaction.groupId).subscribe((data) => {
      console.log(data.latestChit);
      const lastAuction = data.auctionCycle;
      const len=data.allData.length
      const chitData = data.allData[len-1]
      
      console.log(lastAuction);

      if (lastAuction === 19) {
        // Assign full chit amount for last auction 19
        transaction.walletBalance = chitData.foremanCommision*20;
      } else 
      if (lastAuction >= 20) {
        // Assign wallet balance as 0 for auctions >= 20
        transaction.walletBalance = 0;
      } else {
        // Retain wallet balance as-is for other auction cycles
        transaction.walletBalance = transaction.walletBalance || 0;
      }

      // Recalculate total wallet balance after processing each transaction
      this.totalWalletBalance = this.transactions.reduce((total, transaction) => {
        return total + (transaction.walletBalance || 0); // Add walletBalance or 0 if undefined
      }, 0);
    });
  });
});


    this.subscriberService.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      this.data = this.subscriberData.AllSubscriber.map((subscriberDetails, index) => ({

        // enroll: this.subscriberService.getChitGroupById(subscriberDetails?.subscriberId).subscribe(
        //   response => {
        //     this.chitGroups = response;
        //     // Check if the chitGroup length is greater than 1
        //     if (this.chitGroups.length > 1) {
        //       // Increment the totalCount
        //       this.count++;
        //     }
        //   }
        // )

      }))
    })
  }

    fetchChitData(): void {
    this.service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups
      this.total = this.chitdata.length
      this.displayedChit = this.chitdata;
      this.totalPages = Math.ceil(this.displayedChit.length / this.itemsPerPage);
    });
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
    this.chitSubscriberTotal=0
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

          this.service.getTicketId(this.groupId).subscribe((res) => {

            this.bidHistory = res.allData;

            const len = this.bidHistory?.length
            if (len > 0) {
              this.subCount = res.allData.length
              const lastItem = this.bidHistory[len - 1];
              this.latestWinningBid = lastItem?.winningBid;
              this.auctionCycle = res.auctionCycle

            } else {
              this.subCount = 0
              this.latestWinningBid = 0;
              this.auctionCycle = 0

            }
          })
          this.service.getTicketId(this.groupId).subscribe((data)=>{
            const lastAuction=data.auctionCycle
            console.log(lastAuction);
            if (lastAuction<19) {
              this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
                this.payment = response
                this.payment = this.payment.payment
                this.payment.forEach(amount => {
                  this.chitSubscriberTotal = amount.walletBalance
                });
              })
            }else if(lastAuction == 19) {
              this.chitSubscriberTotal =  this.specificChitData.chitAmount
            }else if (lastAuction >=20) {
              this.chitSubscriberTotal =  0
            }else{
              this.chitSubscriberTotal =  0

            }
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

  formatToRupee(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      // style: 'currency',
      currency: 'INR',
      // maximumFractionDigits: 2
    }).format(amount);
  }
  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}

