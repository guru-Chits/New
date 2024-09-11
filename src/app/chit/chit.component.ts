import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChitService } from './shared/service/chit.service';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/service/auth.service';
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

  constructor(private router:Router, private service: ChitService,private authService:AuthService  ){}

  ngOnInit(): void{
    this.authService.checkAccess('Chit Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate=true
      }
    });


    this.service.getAllChit().subscribe((data)=>{
      this.chitdata=data;
      this.chitdata=this.chitdata?.AllChitGroups
      console.log(this.chitdata)
      this.total = this.chitdata.length
      console.log(this.total);
      this.displayedChit= this.chitdata;

      
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
        console.log(this.specificChitData.ChitsGroup)
        this.specificChitData=this.specificChitData.ChitsGroup
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
    
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

  // getColor(member: string): string {
  //   const colors = {
  //     'R': '#5B2C6F',
  //     'B': '#2874A6',
  //     'V': '#C0392B',
  //     'M': '#239B56',
  //     'G': '#F1C40F',
  //     'C': '#E74C3C',
  //     'A': '#2E86C1',
  //     'S': '#1ABC9C',
  //     'N': '#7D3C98',
  //     'D': '#76D7C4',
  //     'E': '#2980B9',
  //     'K': '#8E44AD',
  //     'H': '#F39C12',
  //     'T': '#E67E22'
  //   };
  //   return colors[member] || '#000';
  // }
  
  navigate(id: any){
    this.router.navigate([`chit/view/${id}`]);
  }

  auctionEntry(id: any){
    this.router.navigate([`chit/auction/${id}`])
  }
}
