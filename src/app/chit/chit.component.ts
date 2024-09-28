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
export class ChitComponent implements OnInit{
  breadcrumsData: any = [
    {
      key: 'Chit Management',
      routerLink: 'chit',
    },
  ];
  isChitListVisible:boolean = false;
  showChitDetails: boolean = false;
  chitdata: any;
  data:any[] = [];
  displayedChit:any[]=[]
  specificChitData:any={}
  total: any;
  selectedChit:number=1
  canCreate: boolean = false;
  groupId:string;
  payment:any;
  chitSubscriberTotal = 0;
  bidHistory:any;
  prizedSubsCount: number = 0;
  constructor(private router:Router, private service: ChitService,private authService:AuthService, private paymentService: PaymentService){}

  ngOnInit(): void{
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate=true
      }
    });


    this.service.getAllChit().subscribe((data)=>{
      this.chitdata=data;
      this.chitdata=this.chitdata?.AllChitGroups
      console.log("chit Data ->",this.chitdata)
      this.total = this.chitdata.length
      console.log(this.total);
      this.displayedChit= this.chitdata;
      // this.groupId=this.chitdata?.AllChitGroups;
      // console.log("GROUP ID", this.groupId)
      
    })
  }
  recieveChildBoolean(event:boolean){
  this.showChitDetails=event
  }

  applyFilter(filterValue: string) {
    this.displayedChit= this.chitdata;

    if (!filterValue || !this.data) {
      console.log(this.displayedChit);
      
      return;
    }
  
    this.displayedChit = this.chitdata.filter(subscriber => {
      const groupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
      // const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
      return groupId.includes(filterValue.toLowerCase());
    });
  }

  handleChitGropDetails(id:string,index:number){
    this.showChitDetails=true
    this.selectedChit=index+1
    this.getChitById(id)
    console.log(this.showChitDetails)
  }
  getChitById(id: string): void {
    this.service.getChitById(id).subscribe(
      (data) => {
        
        this.specificChitData=data
        console.log("Specified Data Subscriber",this.specificChitData.ChitsGroup)
        this.specificChitData=this.specificChitData.ChitsGroup
        if(this.specificChitData){
          this.groupId = this.specificChitData.chitGroupId
          console.log("_______^^_______",this.groupId)
          this.paymentService.getTransactionById(this.groupId).subscribe((response)=>{
            console.log("PAYMENT",response);
            this.payment=response
            this.payment=this.payment.payment
            this.payment.forEach(amount => {
              this.chitSubscriberTotal=amount.walletBalance
              console.log(this.chitSubscriberTotal,"red");
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

  getAllChit(){
    this.service.getAllChit().subscribe((data)=>{
      this.chitdata=data;
      this.chitdata=this.chitdata?.AllChitGroups
      console.log(this.chitdata)
      this.total = this.chitdata.length
      console.log(this.total);
      

    //   this.data=this.chitdata.AllChitGroups.map((chitDetails,index)=>({
    //     id:chitDetails._id,
       
    // }))
    // console.log("CHIT ID ===>",  this.chitdata.id)
    })
  }


  getAuctionById(id: string){
    this.service.getChitAuctionById(id).subscribe((res) => {
      this.bidHistory = res.data;
      this.prizedSubsCount = this.bidHistory.filter(item => item.subscriberName).length;
      console.log("____________BID__________HISTORY_____________", this.bidHistory)
    })
  }

  
  navigate(id: any){
    this.router.navigate([`chit/view/${id}`]);
  }

  auctionEntry(id: any){
    this.router.navigate([`chit/auction/${id}`])
  }
}
