import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-auction-sidebar',
  templateUrl: './auction-sidebar.component.html',
  styleUrl: './auction-sidebar.component.css'
})
export class AuctionSidebarComponent {
  @Input() dataFromParent: boolean;
  finalArray:any[]=[];
  @Output() dataToParent = new EventEmitter<boolean>();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataFromParent']) {
      console.log('Boolean value changed:', this.dataFromParent);
      if(this.dataFromParent === true){
        this.finalArray=[]
        for(let i=0;i<this.auction.length;i++){
          if(i===0 || i=== this.auction.length-1){
            this.finalArray.push(this.auction[i])
          }
        }
      }else{
        this.finalArray=this.auction
     }
    }
  }
  ngOnInit(){
    this.finalArray=this.auction
  }
  fullAuction(){
    // this.dataFromParent=false;
    this.dataToParent.emit(false);
    // this.finalArray=this.auction
  }

  auction = [
    {id:'GC-JAN24-IX-100',time:'10:00 am'},
    {id:'GC-JAN24-IX-100',time:'11:00 am'},
    {id:'GC-JAN24-IX-100',time:'12:00 pm'},
    {id:'GC-JAN24-IX-100',time:'1:00 pm'},
    {id:'GC-JAN24-IX-100',time:'2:00 pm'},
    {id:'GC-JAN24-IX-100',time:'3:00 pm'},

  ];
  filteredAuction = [...this.auction];


}
