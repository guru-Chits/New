import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChitService } from './shared/service/chit.service';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/service/auth.service';
import { PaymentService } from '../payments/shared/service/payment.service';
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
  isChitListVisible: boolean = false;
  showChitDetails: boolean = false;
  chitdata: any;
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
  constructor(private router: Router, private service: ChitService, private authService: AuthService, private paymentService: PaymentService) { }

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

  // incrementMonth(): void {
  //   this.auctionDates = this.auctionDates.map(dateString => {
  //     if (dateString) {
  //       // Split the date into day, month, and year
  //       const [day, month, year] = dateString.split('-');

  //       // Convert the month and year to numbers, then increment the month
  //       let newMonth = parseInt(month) + 1;
  //       let newYear = parseInt(year);

  //       // If the new month exceeds 12, adjust the year and reset the month to 1
  //       if (newMonth > 12) {
  //         newMonth = 1;
  //         newYear += 1;
  //       }

  //       // Format the new day, month, and year to ensure two digits for day and month
  //       const updatedDay = day.padStart(2, '0');
  //       const updatedMonth = newMonth.toString().padStart(2, '0');
  //       const updatedYear = newYear.toString();

  //       // Return the updated date in 'DD-MM-YYYY' format
  //       return `${updatedDay}-${updatedMonth}-${updatedYear}`;
  //     }
  //     return null; // Keep null values as they are
  //   });

  //   console.log('Updated Dates ->', this.auctionDates);
  // }

  // filterUpcomingDates(): void {
  //   const today = new Date();

  //   this.upcomingDates = this.auctionDates.filter(dateString => {
  //     if (dateString) {
  //       // Split the date into day, month, and year
  //       const [day, month, year] = dateString.split('-').map(Number);
  //       const date = new Date(year, month - 1, day); // Month is zero-based

  //       // Compare with today's date
  //       return date > today;
  //     }
  //     return false;
  //   });

  //   console.log('Upcoming Dates ->', this.upcomingDates);
  // }

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
            this.bidHistory = res.data;
            const lastItem = this.bidHistory[this.bidHistory.length - 1];
            this.latestWinningBid = lastItem.winningBid;
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

    // console.log("_______^^_______",this.groupId)
    // this.paymentService.getTransactionById(this.groupId).subscribe((response)=>{
    //   console.log("PAYMENT",response);
    //   this.payment=response
    //   this.payment=this.payment.payment
    //   this.payment.forEach(amount => {
    //     this.chitSubscriberTotal=amount.walletBalance
    //     console.log(this.chitSubscriberTotal,"red");
    //   }); 
    // })
  }

  getAllChit() {
    this.service.getAllChit().subscribe((data) => {
      this.chitdata = data;
      this.chitdata = this.chitdata?.AllChitGroups
      this.total = this.chitdata.length

      //   this.data=this.chitdata.AllChitGroups.map((chitDetails,index)=>({
      //     id:chitDetails._id,

      // }))
    })
  }


  getAuctionById(id: string) {
    this.service.getChitAuctionById(id).subscribe((res) => {
      this.bidHistory = res.data;
      this.prizedSubsCount = this.bidHistory.filter(item => item.subscriberName).length;
    })
  }


  navigate(id: any) {
    this.router.navigate([`chit/view/${id}`]);
  }

  auctionEntry(id: any) {
    this.router.navigate([`chit/auction/${id}`])
  }
}
