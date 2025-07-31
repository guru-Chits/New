import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ChitService } from './shared/service/chit.service';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/service/auth.service';
import { PaymentService } from '../payments/shared/service/payment.service';
import { SubscriberService } from '../subscriber/shared/service/subscriber.service';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-chit',
  templateUrl: './chit.component.html',
  styleUrl: './chit.component.css',
  providers: [DatePipe]
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
  totalAmountOutstanding: number = 0
  totalAmounttoPay: number
  showBlur:boolean=false
  totalPayment:any
  displayedAuctions: any
  chitGroups: any
  showGroups: boolean = false
  highlightedGroups: Set<string> = new Set();
  walletBalance:any
  amountPaid:any
  constructor(private router: Router, private service: ChitService, private datePipe: DatePipe, private authService: AuthService, private subscriberService: SubscriberService, private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate = true
      }
    });
    this.service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups
      this.totalCaluation(this.chitdata)
      this.total = this.chitdata.length
      this.displayedChit = this.chitdata;
      this.displayedChit.forEach((group: any) => {
      this.service.getTicketId(group.chitGroupId).subscribe((data) => {
          group.auctionCycle = data.auctionCycle; // attach to each group
        });
      });

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
          const lastAuction = data.auctionCycle;
          const len = data.allData.length
          const chitData = data.allData[len - 1]

          if (lastAuction === 19) {
            // Assign full chit amount for last auction 19
            transaction.walletBalance = chitData.foremanCommision * 20;
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


shouldHighlight: boolean = false;

async totalCaluation(chitdata: any) {
  let totalAmountToPay = 0;

  // ✅ 1. Get all payments
  const allPayments = await this.paymentService.getPaymentAll().toPromise();
  this.totalPayment = allPayments;
  this.totalAmountOutstanding = this.totalPayment?.AllPayment?.reduce((sum, payment) => {
    return sum + Number(payment.amount || 0);
  }, 0);

  // ✅ 2. Loop each chit group
  for (const data of chitdata) {
    const groupId = data.chitGroupId;
    const chitAmount = Number(data.chitAmount || 0);
    const numSubscribers = Number(data.chitSubscribers?.length || 0);

    try {
      const auctionCycleData = await this.service.getTicketId(groupId).toPromise();
      const latestChit = auctionCycleData?.allData || [];

      if (!latestChit.length) continue;

      const firstAuction = latestChit[0]?.date;
      const auctionLength = latestChit.length;

      const lastAuction =
        auctionLength === 20
          ? latestChit[auctionLength - 2]?.date
          : latestChit[auctionLength - 1]?.date;

      if (!firstAuction || !lastAuction) continue;

      const monthDiff = this.getMonthDifference(firstAuction, lastAuction);

      const response = await this.paymentService.getTransactionById(groupId).toPromise();
       this.walletBalance=response
      const walletBalance = Number(this.walletBalance?.payment?.[0]?.walletBalance || 0);
      const wallet = chitAmount - walletBalance;

      const baseAmount = monthDiff * (chitAmount / 20) * numSubscribers;
      const walletAdjustment = auctionLength === 20 ? (wallet / 20) * numSubscribers : 0;

      const groupAmountToPay = baseAmount + walletAdjustment;
      totalAmountToPay += groupAmountToPay;

      // ✅ Fetch amount paid by this group's subscribers
      const payData = await this.paymentService.getByGroupId(groupId).toPromise();
      this.amountPaid = payData
      const totalPaid = Number(this.amountPaid.totalAmount || 0);

      // ✅ Check if expected and paid amounts match
      if (Math.abs(totalPaid - groupAmountToPay) < 1) {
        this.highlightedGroups.add(groupId);
      }

    } catch (error) {
      console.error("Error in group:", groupId, error);
    }
  }

  this.totalAmounttoPay = totalAmountToPay;
  const difference = this.totalAmountOutstanding - this.totalAmounttoPay;
  this.showBlur = Math.abs(difference) < 1; // optional global check
}



  getMonthDifference(startDateStr: string, endDateStr: string): number {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = endDate.getMonth() - startDate.getMonth();

    return yearsDiff * 12 + monthsDiff + 1;
  }

  getOutstandingBalance(groupId: string, passbookNo: string, chitAmount: number): Promise<number> {
    return new Promise((resolve) => {
      this.service.getTicketId(groupId).subscribe((acuData) => {
        const auctionData = acuData.allData;
        const firstAuc = this.datePipe.transform(auctionData[0].date, 'yyyy-MM');
        const lastAuc = this.datePipe.transform(auctionData[auctionData.length - 1].date, 'yyyy-MM')
        const difference = this.getMonthDifference(firstAuc, lastAuc)

        this.paymentService.getTotalByGroupId(firstAuc, groupId, passbookNo, lastAuc).subscribe((PayData) => {

          if ((difference + acuData.profitCount) == 20) {
            this.paymentService.getTransactionById(groupId).subscribe((response: any) => {
              const wallet = (chitAmount - response.payment[0].walletBalance) / 20
              const toPay = (difference - 1) * chitAmount / 20 + wallet
              const paid = PayData.totalSubPassbookNoAmount;
              const balance = toPay - paid;
              resolve(balance);

            })
          } else {
            const toPay = (difference) * chitAmount / 20;
            const paid = PayData.totalSubPassbookNoAmount;
            const balance = toPay - paid;
            resolve(balance);

          }
        });
      });
    });
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
    this.chitSubscriberTotal = 0
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
          this.service.getTicketId(this.groupId).subscribe((data) => {
            const lastAuction = data.auctionCycle
            if (lastAuction < 19) {
              this.paymentService.getTransactionById(this.groupId).subscribe((response) => {
                this.payment = response
                this.payment = this.payment.payment
                this.payment.forEach(amount => {
                  this.chitSubscriberTotal = amount.walletBalance
                });
              })
            } else if (lastAuction == 19) {
              this.chitSubscriberTotal = this.specificChitData.chitAmount
            } else if (lastAuction >= 20) {
              this.chitSubscriberTotal = 0
            } else {
              this.chitSubscriberTotal = 0

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

