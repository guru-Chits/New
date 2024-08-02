import { Component, OnInit } from '@angular/core';
import { SubscriberService } from '../shared/service/subscriber.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subscriber-view',
  templateUrl: './subscriber-view.component.html',
  styleUrl: './subscriber-view.component.css'
})
export class SubscriberViewComponent implements OnInit{
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image

  isShowDiv = false;  
 subscriberDetail:any
 subscriberData:any
 data: any[] = [];
 displayedSubscribers:any
 subscriberId:string
constructor(private service:SubscriberService,private activatedRoute:ActivatedRoute,private router:Router){}

ngOnInit(): void {
  this.activatedRoute.params.subscribe(paramData => {
    if (Object.keys(paramData).length) {
    this.service.getsubscriberById(paramData.id).subscribe((data) => {
      this.subscriberDetail = data;
      this.subscriberId=this.subscriberDetail.Subscriber._id
      console.log(this.subscriberDetail)
      console.log(this.subscriberId);
      
       })
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

}
  toggleDisplayDiv() {  
    this.isShowDiv = !this.isShowDiv;  
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
}
