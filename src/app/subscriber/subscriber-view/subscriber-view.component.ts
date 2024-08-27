import { Component, OnInit } from '@angular/core';
import { SubscriberService } from '../shared/service/subscriber.service';
import { ActivatedRoute, ResolveStart, Router } from '@angular/router';
import { ChitService } from '../../chit/shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';

@Component({
  selector: 'app-subscriber-view',
  templateUrl: './subscriber-view.component.html',
  styleUrl: './subscriber-view.component.css'
})
export class SubscriberViewComponent implements OnInit{
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  breadcrumsData: any = [];
  chitGroupId: string;
  passbookNo: string;
  date:string;
  isShowDiv = false;  
 subscriberDetail:any
 subscriberData:any
 data: any[] = [];
 paymentData:any[]=[];
 displayedSubscribers:any
 chitGroup:any
 subscriberId:string
 paymentHistory:any
 selectedIndex: string | null = null;
constructor(private service:SubscriberService,private activatedRoute:ActivatedRoute,private router:Router,private chitService:ChitService,private paymentService:PaymentService){}

ngOnInit(): void {
  this.activatedRoute.params.subscribe(paramData => {
    if (Object.keys(paramData).length) {
    this.service.getsubscriberById(paramData.id).subscribe((data) => {
      this.subscriberDetail = data;
      this.subscriberId=this.subscriberDetail.Subscriber._id
      console.log(this.subscriberDetail)
      console.log("sib",this.subscriberDetail);

      this.service.getChitGroupById(this.subscriberDetail.Subscriber.subscriberId).subscribe(
        response => {
          this.chitGroup=response
          console.log(this.chitGroup,"ghit");
        },
      );
       })

       this.breadcrumsData = [
      {
        key: 'Subscriber Management',
        routerLink: '/subscriber',
      },
      
      {
        key: 'View Subscriber',
        routerLink: `subscriber/view/${paramData.id}`,
      },
    ];


    }
    })
    this.service.getsubscriberAll().subscribe((data)=>{
      this.subscriberData=data;
  
      console.log("subscriber data",this.subscriberData);
     
      this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
        id:subscriberDetails?._id,
        subscriberId: subscriberDetails?.subscriberId,
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
        subscriberProfile:subscriberDetails?.profileImageUrl
      }))
      this.displayedSubscribers = this.data;
    })
    console.log(this.subscriberId,"siub");
    

  }


  getByPassbook(passbookNo:string,index:any){

    if (this.selectedIndex === index) {
      // If the selected index is already active, toggle off
      this.selectedIndex = null;
      this.paymentData = [];
      this.isShowDiv = this.isShowDiv;  
      
    } 
    else{
      this.selectedIndex = index;
      this.isShowDiv = !this.isShowDiv;  

      this.paymentService.getPaymentByPassbook(passbookNo).subscribe(response=>{
        console.log(response);
        this.paymentHistory=response
        this.paymentData=this.paymentHistory.payments.map((paymentDetail,index)=>({
        receiptNumber:paymentDetail.receiptNumber,
        amount:paymentDetail.amount,
        groupId:paymentDetail.groupId,
        }))
        
       })
    }


  }
  toggleDisplayDiv() {  
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
      this.displayedSubscribers = this.data; // Show all if there's no filter or data is not defined
      return;
    }
  
    this.displayedSubscribers = this.data.filter(subscriber => {
      const subscriberId = subscriber.subscriberId ? subscriber.subscriberId.toString().toLowerCase() : '';
      const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
      return subscriberId.includes(filterValue.toLowerCase()) || subscriberName.includes(filterValue.toLowerCase());
    });
    }

  viewFile(url: string): void {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL is not provided');
    }
  }

  getSub(id:any){
    console.log(id);
    
    this.service.getsubscriberById(id).subscribe((data) => {
      this.subscriberDetail = data;
      console.log(this.subscriberDetail)      
       })

  }
  edit(id:any){
    this.router.navigate([`subscriber/edit/${id}`]);

  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();
    
    // Determine the day suffix
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
