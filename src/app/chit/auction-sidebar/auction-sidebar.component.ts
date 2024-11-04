import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ChitService } from '../shared/service/chit.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-auction-sidebar',
  templateUrl: './auction-sidebar.component.html',
  styleUrl: './auction-sidebar.component.css'
})
export class AuctionSidebarComponent {
  auctions:any
  chitdata:any;
  displayedAuctions:any
  showGroups:boolean=false
  constructor(private service:ChitService,private router:Router){}
  
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['dataFromParent']) {
  //     if(this.dataFromParent === true){
  //       this.finalArray=[]
  //       for(let i=0;i<this.finalArray.length;i++){
  //         if(i===0 || i=== this.finalArray.length-1){
  //           this.finalArray.push(this.finalArray[i])
  //         }
  //       }
  //     }else{
  //       this.finalArray=this.finalArray
  //    }
  //   }
  // }
  // ngOnInit(){
  //   this.finalArray=this.auction
    
  //   this.service.getAllChit().subscribe((data)=>{
  //     // this.chitdata=data;
  //     // this.chitdata=this.chitdata?.AllChitGroups
  //     // console.log("AUCTION SIDEBAR", this.chitdata)
  //     //   // Transform chitdata to contain groupId and createdAt
  //     // this.finalArray = this.chitdata.map((item: any) => {
  //     //   return {
  //     //     groupId: item.chitGroupId,
  //     //     auctionDate : item.auctionDate,
  //     //   };
  //     // });
  //     this.chitdata = data;
  //     this.chitdata = this.chitdata?.AllChitGroups || []; // Ensure chitdata is an array
    
  //     console.log("AUCTION SIDEBAR", this.chitdata);
    
  //     // Get today's date in the required format (DD-MM-YYYY)
  //     const today = new Date();
  //     const formattedToday = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    
  //     // Filter chitdata for today's auction dates
  //     this.finalArray = this.chitdata
  //       .filter(item => item.auctionDate === formattedToday) // Keep only today's auctions
  //       .map(item => ({
  //         groupId: item.chitGroupId,
  //         createdAt: item.createdAt,
  //       }));
    
  //     // Optional: Log the final array to see today's auctions
  //     console.log("Today's Auctions ->", this.finalArray);
  //   })
  //   // this.service.getAllChit().subscribe((data) => {
  //   //   this.chitdata = data?.AllChitGroups;
  //   // //   this.chitdata=this.chitdata?.AllChitGroups

  //   //   console.log("AUCTION SIDEBAR", this.chitdata);
  //     this.updateFinalArray();
  //   // });
  // }
  ngOnInit() {
    // this.service.getAllChit().subscribe((data) => {
    //   this.chitdata = data;
    //   this.chitdata = this.chitdata?.AllChitGroups || []; // Ensure chitdata is an array
    
    //   // Update auction dates to next month
    //   this.chitdata.forEach((item: any) => {
    //     if (item.auctionDate) {
    //       // Split auctionDate to get day, month, and year
    //       const [day, month, year] = item.auctionDate.split('-').map(Number);
  
    //       // Create a Date object and increment the month
    //       const newDate = new Date(year, month, day);
    //       newDate.setMonth(newDate.getMonth()); // Increase month by 1 (month is zero-based)
  
    //       // Format the updated date as DD-MM-YYYY
    //       const updatedDay = newDate.getDate().toString().padStart(2, '0');
    //       const updatedMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');
    //       const updatedYear = newDate.getFullYear();
  
    //       // Update the item's auctionDate
    //       item.auctionDate = `${updatedDay}-${updatedMonth}-${updatedYear}`;
    //     }
    //   });
  
    //   // Get today's date in the required format (DD-MM-YYYY)
    //   const today = new Date();
    //   const formattedToday = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
  
    //   // Filter chitdata for today's auction dates
    //   this.finalArray = this.chitdata
    //     .filter(item => item.auctionDate === formattedToday) // Keep only today's auctions
    //     .map(item => ({
    //       groupId: item.chitGroupId,
    //       createdAt: item.createdAt,
    //     }));
  
    //   // Optional: Log the final array to see today's auctions
    // });
    this.service.getAuctionToday().subscribe((data=>{
      this.auctions=data
      this.auctions=this.auctions.todaysAuction
      this.displayedAuctions=this.auctions.slice(0,5)
      console.log(this.auctions);

    }))
 
  }
  applyFilter(filterValue: string) {
    this.displayedAuctions = this.auctions;
    if (!filterValue || !this.auctions) {
      return;
    }
  
    this.displayedAuctions = this.auctions.filter(subscriber => {
      const chitGroupId = subscriber.chitGroupId ? subscriber.chitGroupId.toString().toLowerCase() : '';
      // const subscriberName = subscriber.subscriberName ? subscriber.subscriberName.toLowerCase() : '';
      return chitGroupId.includes(filterValue.toLowerCase());
    });
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
  
  // updateFinalArray() {
  //   // Format today's date to match 'DD-MM-YYYY'
  //   const today = new Date();
  //   const formattedToday = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

  //   // Filter chitdata to include only those with auctionDate equal to today
  //   this.finalArray = this.chitdata
  //     .filter(item => item.auctionDate === formattedToday)
  //     .map(item => ({
  //       groupId: item.chitGroupId,
  //       createdAt: item.createdAt,
  //     }));
  // }

  // fullAuction(){
  //   // this.dataFromParent=false;
  //   this.dataToParent.emit(false);
  //   // this.finalArray=this.auction
  //   this.ngOnInit()
  // }

  // auction = [
  //   {id:'GC-JAN24-IX-100',time:'10:00 am'},
  //   {id:'GC-JAN24-IX-100',time:'11:00 am'},
  //   {id:'GC-JAN24-IX-100',time:'12:00 pm'},
  //   {id:'GC-JAN24-IX-100',time:'1:00 pm'},
  //   {id:'GC-JAN24-IX-100',time:'2:00 pm'},
  //   {id:'GC-JAN24-IX-100',time:'3:00 pm'},

  // ];
  // filteredAuction = [...this.auction];


}
