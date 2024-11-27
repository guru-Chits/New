import { Component, OnInit } from '@angular/core';
import { SubscriberService } from '../shared/service/subscriber.service';
import { ActivatedRoute, ResolveStart, Router } from '@angular/router';
import { ChitService } from '../../chit/shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subscriber-view',
  templateUrl: './subscriber-view.component.html',
  styleUrl: './subscriber-view.component.css',
  providers: [DatePipe]

})
export class SubscriberViewComponent implements OnInit {
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  breadcrumsData: any = [];
  chitGroupId: string;
  passbookNo: string;
  date: string;
  isShowDiv = false;
  subscriberDetail: any
  subscriberData: any
  data: any[] = [];
  paymentData: any[] = [];
  displayedSubscribers: any
  chitGroup: any
  subscriberId: string
  paymentHistory: any
  verified: any
  selectedIndex: string | null = null;
  itemsPerPage = 10; // Default items per page
  showAll = false;
  paymentHistoryToggled: boolean[] = [];
  canEdit = false
  aucData: any
  constructor(private service: SubscriberService, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private chitService: ChitService, private paymentService: PaymentService,    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.authService.checkAccess('Subscriber Management', 'edit').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canEdit = true
      }
    });
    this.activatedRoute.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
        this.service.getsubscriberById(paramData.id).subscribe((data) => {
          this.subscriberDetail = data;
          this.subscriberId = this.subscriberDetail.Subscriber._id
          this.service.getChitGroupById(this.subscriberDetail.Subscriber.subscriberId).subscribe(data => {
            this.chitGroup = data;  // Array of chit groups
            this.chitGroup.forEach((group, index) => {
              this.chitService.getSubAuction(group.passbookNo).subscribe(response => {
                if (response.subscriberAuc.passbookNumber) {
                  this.chitGroup[index].chitAuc = response.subscriberAuc;
                }
                else if (response.subscriberAuc.profitChitData) {
                  this.chitGroup[index].chitAuc = response.subscriberAuc.profitChitData;
                } else if (response.subscriberAuc.TKNData) {
                  if (response.subscriberAuc?.TKNData?.passbookNumber) {
                    this.chitGroup[index].chitAuc = response.subscriberAuc.TKNData;
                  }
                } else if (response.subscriberAuc.extraPaymentData) {
                  this.chitGroup[index].chitAuc = response.subscriberAuc.extraPaymentData;
                } else if (response.subscriberAuc.passbookNumber) {
                  this.chitGroup[index].chitAuc = response.subscriberAuc;
                }
              });
            });
          });
        })

        this.breadcrumsData = [
          {
            key: 'Subscriber Management',
            routerLink: '/subscriber',
          },
          {
            key: 'Subscriber Details',
            routerLink: `subscriber/view/${paramData.id}`,
          },
        ];
      }
    })
    this.service.getsubscriberAll().subscribe((data) => {
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
  getByPassbook(passbookNo: string, index: any) {
    this.paymentHistoryToggled[index] = !this.paymentHistoryToggled[index];
    this.paymentService.verifyPassbookNo(passbookNo).subscribe(data => {
      this.verified = data.verified
      if (this.selectedIndex === index) {
        // If the selected index is already active, toggle off
        this.selectedIndex = null;
        this.paymentData = [];
        this.isShowDiv = this.isShowDiv;

      }
      else {
        this.selectedIndex = index;
        this.isShowDiv = !this.isShowDiv;
        this.paymentService.getPaymentByPassbook(data.passbookno).subscribe(response => {
          this.paymentHistory = response;
        
          let installmentNo = 0; // Start from 1
          let previousInstallmentMonth = ''; // Track the last installmentMonth
        
          this.paymentData = this.paymentHistory.payments.map((paymentDetail, index) => {
            // Check if the current installmentMonth differs from the previous one
            if (paymentDetail.installmentMonth !== previousInstallmentMonth) {
              installmentNo++; // Increment the installment number
              previousInstallmentMonth = paymentDetail.installmentMonth; // Update the previous installmentMonth
            }
        
            return {
              receiptNumber: paymentDetail.receiptNumber,
              installmentMonth: paymentDetail.installmentMonth,
              installmentNo: installmentNo, // Assign the calculated installment number
              date: this.datePipe.transform(paymentDetail.date, 'dd-MM-yyyy') || '',
              amount: paymentDetail.amount,
              groupId: paymentDetail.groupId,
              collectionType: paymentDetail.collectionType,
            };
          });
        });
        
      }
    })
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  applyFilter(filterValue: string) {
    if (!filterValue || !this.data) {
      this.displayedSubscribers = this.data.slice(0, this.itemsPerPage); // Reset to first page if no filter
      return;
    }

    // Filter based on subscriber ID or Name
    const filteredSubscribers = this.data.filter(subscriber => {
      const subscriberId = subscriber.subscriberId ? subscriber.subscriberId.toString().toLowerCase() : '';
      const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
      return subscriberId.includes(filterValue.toLowerCase()) || subscriberName.includes(filterValue.toLowerCase());
    });

    // Update the displayed subscribers with the filtered data
    this.displayedSubscribers = filteredSubscribers.slice(0, this.itemsPerPage); // Limit filtered result to 10
  }
  viewMore() {
    if (!this.showAll) {
      this.displayedSubscribers = this.data; // Show all subscribers
      this.showAll = true;
    }
  }

  viewFile(url: string): void {
    if (url) {
      window.open(url, '_blank');
    } else {
    }
  }

  getSub(id: any) {
    this.service.getsubscriberById(id).subscribe((data) => {
      this.subscriberDetail = data;
      this.service.getChitGroupById(this.subscriberDetail.Subscriber.subscriberId).subscribe(data => {
        this.chitGroup = data;  // Array of chit groups
        this.chitGroup.forEach((group, index) => {
          this.chitService.getSubAuction(group.passbookNo).subscribe(response => {
            if (response.subscriberAuc.passbookNumber) {
              this.chitGroup[index].chitAuc = response.subscriberAuc;

            }
            else if (response.subscriberAuc.profitChitData) {
              this.chitGroup[index].chitAuc = response.subscriberAuc.profitChitData;
            } else if (response.subscriberAuc.TKNData) {
              if (response.subscriberAuc?.TKNData?.passbookNumber) {
                this.chitGroup[index].chitAuc = response.subscriberAuc.TKNData;
              }
            } else if (response.subscriberAuc.extraPaymentData) {
              this.chitGroup[index].chitAuc = response.subscriberAuc.extraPaymentData;
            } else if (response.subscriberAuc.passbookNumber) {
              this.chitGroup[index].chitAuc = response.subscriberAuc;
            }
          });
        });
      });
    })

  }
  edit(id: any) {
    if (this.canEdit) {
      this.router.navigate([`subscriber/edit/${id}`]);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();

    const suffix = (day) => {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  }
}
