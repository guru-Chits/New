import { Component,OnInit } from '@angular/core';
import { ITableColumn } from '../../shared/interface/list-table';
import { Router ,ActivatedRoute } from '@angular/router';
import { ChitService } from '../shared/service/chit.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
import { AuthService } from '../../shared/service/auth.service';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { Subscriber } from 'rxjs';
@Component({
  selector: 'app-chit-view',
  templateUrl: './chit-view.component.html',
  styleUrl: './chit-view.component.css'
})
export class ChitViewComponent implements OnInit{
  data: any[] = [];
  subscribers:any[]=[]
  addSubscribers:any[]=[]
  chitData:any;
  breadcrumsData: any = [];
  chitId:string="";
  payment:any
  totalChitData:any;  
  groupId:string;
  walletBalance:any
  chitSubscriberTotal = 0;
  addSubscriberTotal = 0;
  canCreate: boolean = false;
  showChitDetails: any;
  chitDetail: any;
  specificChitData: any;
  showTicket: boolean = false;
  ticketDetail: any;
  filteredSubscribers: any;
  filteredAdditionalSubs: any;
  isSubscriberListVisible: boolean = false;
  displayedSubscribers: any[];
  subscriberData:any={}
  listId:any
  subscriberDetail: any;
  currentListType: 'additional' = 'additional';
  modalErrorMessage: string = '';
  addSubData:any={}
  ticketId: number= 1;
  viewSubscriber : any;
  bidHistory: any;
  filteredHistory: any;
  showBidHistory: boolean = false;
  displayedChit:any[]=[]
  constructor(private activatedRoute:ActivatedRoute,private router:Router, private service: ChitService,private paymentService:PaymentService,private authService:AuthService, private subservice:SubscriberService){}

  getAllChit(){
    this.service.getAllChit().subscribe((data)=>{
      this.totalChitData=data;
      // this.total = this.chitdata.AllChitGroups.chitSubscribers.length
      
      this.totalChitData=this.totalChitData?.AllChitGroups
      console.log("TOTAL CHIT DATA", this.totalChitData)
    //   this.data=this.chitdata.AllChitGroups.map((chitDetails,index)=>({
    //     id:chitDetails._id,
       
    // }))
    // console.log("CHIT ID ===>",  this.chitdata.id)
    })
  }

  ngOnInit(): void {
    this.getAllChit()
    this.getAllAuction()
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate=true
      }
    })
    this.activatedRoute?.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
      this.service.getChitById(paramData.id).subscribe((data) => {
        this.chitData = data;
        this.chitData=this.chitData.ChitsGroup;
        this.groupId=this.chitData.chitGroupId;

        console.log(this.chitData.addChitSubscribers);
        console.log("chit Data =====", this.chitData)
        if (this.chitData.addChitSubscribers && this.chitData.addChitSubscribers.length > 0) {
          // Get the last object in the array
          const lastSubscriber = this.chitData.addChitSubscribers[this.chitData.addChitSubscribers.length - 1];
          
          // Extract the ticketId from the last object
          const lastTicketId = lastSubscriber.ticketId;
      
          // Set the ticketId to a variable (or use it as needed)
          console.log("Last Ticket ID:", lastTicketId);
          this.ticketId = lastTicketId;  // Assign it to a variable for further use
        } else {
          console.log("No subscribers found in addChitSubscribers");
        }
        this.paymentService.getTransactionById(this.groupId).subscribe((response)=>{
          console.log("PAYMENT",response);
          this.payment=response
          this.payment=this.payment.payment
          this.payment.forEach(amount => {
            this.chitSubscriberTotal=amount.walletBalance
            console.log(this.chitSubscriberTotal,"red");
          }); 
        })

        console.log(this.chitData);
        this.breadcrumsData = [
          {
            key: 'Chit Management',
            routerLink: '/chit',
          },
          
          {
            key: 'Chit Group Details',
            routerLink: `chit/view/${paramData.id}`,
          },
        ];

        
        this.subscribers = this.chitData.chitSubscribers;
        this.addSubscribers = this.chitData.addChitSubscribers;
  
  
        // You can also store these values in separate arrays if needed
        const subscriberDetails = this.subscribers.map(subscriber => ({
          aliasName: subscriber.aliasName,
          firstName: subscriber.firstName,
          passbookNo:subscriber.passbookNo,
          place: subscriber.place,
          occupation: subscriber.occupation,
          subscriberId:subscriber.subscriberId,
          ticketId:subscriber.ticketId,
          profileImageUrl:subscriber.profileImageUrl,
          id: subscriber._id

        }));
  
        const addSubscriberDetails =  this.addSubscribers.map(subscriber => ({
          aliasName: subscriber.aliasName,
          firstName: subscriber.firstName,
          passbookNo:subscriber.passbookNo,
          place: subscriber.place,
          occupation: subscriber.occupation,
          subscriberId:subscriber.subscriberId,
          ticketId:subscriber.ticketId,
          profileImageUrl:subscriber.profileImageUrl

        }));
  
        console.log('Subscriber Details:', subscriberDetails);
        console.log('Additional Subscriber Details:', addSubscriberDetails);
  });
}
});
  }

  getTickedByID(id: string, gropid: string): void{
    this.service.getSubscriberByTicketId(gropid,id).subscribe(
     data =>{
      this.viewSubscriber = data
     },
     error => {
      console.error("Error occured",error);
     } 
     
    );

  }
  closeTicket(type: 'close'){
    this.showTicket = false;
  }

  showSubscriberList(type: 'chit' | 'additional'): void {
    this.isSubscriberListVisible = true;
    this.subservice.getsubscriberAll().subscribe((data)=>{
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

  onButtonClick(id: string): void {
    this.getSubscribersById(id);
    this.listId=id

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
  
        console.log(this.subscriberDetail)
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
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

  applyFilterchit(filterValue: string) {
    this.displayedChit= this.totalChitData;
    console.log("displaying chit ===", this.displayedChit)
    if (!filterValue || !this.data) {
      console.log(this.displayedChit);
      
      return;
    }
  
    this.displayedChit = this.totalChitData.filter(subscriber => {
      const groupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
      // const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
      return groupId.includes(filterValue.toLowerCase());
    });
  }

  addSelectedSubscriber(subscriber: any): void {
    if (this.listId == subscriber) {
      if (this.currentListType === 'additional') {
        this.addAdditionalSubscriberById(subscriber);
      }
      this.subscriberDetail = null;
    }
  }

  addAdditionalSubscriberById(id: string): void {
    debugger
    const addChitSubscribers = this.chitData.addChitSubscribers || [];
    const chitSubscribers = this.chitData.chitSubscribers || [];
    
    if (addChitSubscribers.length >= 5) {
      this.showModal('Cannot add more than 5 additional subscribers.');
      return;
    }
  
    this.subservice.getsubscriberById(id).subscribe(
      res => {
        this.addSubData = res;
        this.ticketId = Number(this.ticketId) || 0; 
        this.ticketId += 1
        const newSubscriber = {
          ticketId: this.ticketId,
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
  
        // this.ticketId = this.ticketId + 1;
        console.log('ticket ID', this.ticketId)
        addChitSubscribers.push(newSubscriber);
  
        // Update the table data for additional subscribers
        this.addSubscribers = [...addChitSubscribers];
      },
      error => {
        console.error('Error fetching subscriber:', error);
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

  removeSubscriber(){
    let subscriberId = this.filteredSubscribers[0]?.subscriberId

    let chitgroupId = this.chitData.chitGroupId
    console.log(subscriberId, chitgroupId)
    this.service.deleteSubscriber(chitgroupId, subscriberId).subscribe((res) => {
      console.log(res)
    })
  }

  getAllAuction(){
    this.service.getAllChitAuction().subscribe((res) => {
      console.log("AUCTION ALL DATA",res)
      this.bidHistory = res.data;
      const history =this.bidHistory
      this.filteredHistory = this.bidHistory.filter(data => !data?.TKNData);
      
      console.log(this.filteredHistory);
    })
  }

  openBidHistory(){
    this.showBidHistory = !this.showBidHistory
    console.log(this.showBidHistory)
  }

  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    const ticketId = params.data.ticketId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="35" height="35" style="border-radius: 50%; margin-right: 10px;">
        <span style="color: #50A1A5;">${ticketId}</span>
      </div>
    `;
  }

  // handleChitGropDetails(id:string,index:number){
  //   this.showChitDetails=true
  //   this.getChitById(id)
  //   console.log(this.showChitDetails)
  // }
  // getChitById(id: string): void {
  //   this.service.getChitById(id).subscribe(
  //     (data) => {
        
  //       this.specificChitData=data
  //       console.log(this.specificChitData.ChitsGroup)
  //       this.specificChitData=this.specificChitData.ChitsGroup
  //     },
  //     error => {
  //       console.error('Error fetching subscriber', error);
  //     }
  //   );
    
  // }

  // getChit(id:any){
  //   console.log(id);
    
  //   this.service.getChitById(id).subscribe((data) => {
  //     this.chitDetail = data;
  //     console.log(this.chitDetail)      
  //      })

  // }

  navigate(id: any){
    this.router.navigate([`chit/view/${id}`]);
  }
  // getChitById(id: string){
  //   console.log("DATA", id)
    
  // }

  auctionEntry(id: any){
    this.router.navigate([`chit/auction/${id}`])
  }

  getChitById(id: string){
    console.log("DATA", id);
    this.showTicket = true;
    // Filter the subscriberDetails by matching id
     this.filteredSubscribers = this.subscribers.filter(subscriber => subscriber._id === id);
    this.filteredAdditionalSubs = this.addSubscribers.filter(subscriber => subscriber._id === id);
    // Log or return the filtered result
    console.log("Filtered Subscribers", this.filteredSubscribers);
    return this.filteredSubscribers;
  }  


  
  subscriberColumn : ITableColumn[]= [
    {
      label: 'profileImageUrl',
      field: 'Ticket ID',
      filter:false,
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id)
    },  { label: 'Name', field: 'firstName', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Alias Name', field: 'aliasName', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Passbook Number', field: 'passbookNo', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Place', field: 'place', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Occupation', field: 'occupation', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },

];

// Column definitions for addChitSubscribers
  addSubscriberColumn = [
    {
      label: 'profileImageUrl',
      field: 'Ticket ID',
      filter:false,
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id)
    },  { label: 'Name', field: 'firstName', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id)},
  { label: 'Alias Name', field: 'aliasName', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Passbook Number', field: 'passbookNo', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Place', field: 'place', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },
  { label: 'Occupation', field: 'occupation', onCellClicked: (event: CellClickedEvent) => this.getChitById(event.data._id) },


  ]

  DummyData = [
    {
      label: 'Auction No', field: 'auctionCycle'
    },
    {
      label: 'Ticket ID', field: 'ticketId'
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

}
