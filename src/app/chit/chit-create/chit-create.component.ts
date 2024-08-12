import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
// import { SubscriberDetails } from '../shared/interface/chit';

@Component({
  selector: 'app-chit-create',
  templateUrl: './chit-create.component.html',
  styleUrl: './chit-create.component.css'
})
export class ChitCreateComponent {

  gridApi: any;
  data : any[] = [];
  subscriberDetail: any;
  subscriberData:any={}
  displayedSubscribers: any[];
  isSubscriberListVisible:boolean = false;
  searchInput:string=""

  constructor( private service:SubscriberService) {

  }
  onSubmit(){

  }
  ngOnInit(): void{
    // this.service.getsubscriberAll().subscribe((data)=>{
    //   this.subscriberData=data;
    //   console.log("subscriber data",this.subscriberData);
     
    //   this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
    //     id:subscriberDetails?._id,
    //     subscriberId: subscriberDetails?.subscriberId,
    //     subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
    //     subscriberProfile:subscriberDetails?.profileImageUrl
    //   }))
    //   this.displayedSubscribers = this.data;
    // })
  }
  column: ITableColumn[] = [
    { label: 'Profile', field: 'subscriberProfile', sortable: false },
    // { label: 'Ticket ID', field:'Ticket ID', sortable: true },
    { label: 'Name', field: 'name', sortable: true },
    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true }
  ];

  // getAllSubscriber(): void{
  //   this.service.getsubscriberAll().subscribe((data)=>{
  //     this.subscriberData=data;
  //     console.log("subscriber data",this.subscriberData);
     
  //     this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
  //       id:subscriberDetails?._id,
  //       subscriberId: subscriberDetails?.subscriberId,
  //       subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
  //       subscriberProfile:subscriberDetails?.profileImageUrl
  //     }))
  //     this.displayedSubscribers = this.data;
  //   })
  // }

  applyFilter(filterValue: string) {
    this.searchInput=filterValue
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
  // applyFilter(filterValue: string) {
  //   if (!filterValue) {
  //     this.displayedSubscribers = this.data; 
  //     return;
  //   }
  
  //   this.service.getSubscriberFiltered(filterValue).subscribe((filteredData: SubscriberDetails[]) => {
  //     this.data = filteredData.map((subscriberDetails) => ({
  //       id: subscriberDetails._id,
  //       subscriberId: subscriberDetails.subscriberId,
  //       subscriberName: `${subscriberDetails.firstName} ${subscriberDetails.lastName}`,
  //       subscriberProfile: subscriberDetails.profileImageUrl
  //     }));
  //     this.displayedSubscribers = this.data;
  //   });
  // }
  // applyFilter(filterValue: string) {
  //   console.log('Filter Value:', filterValue); // Debugging filter value
  
  //   if (!filterValue) {
  //     this.displayedSubscribers = this.data; // Show all if there's no filter value
  //     return;
  //   }
  
  //   this.service.getSubscriberFiltered(filterValue).subscribe(
  //     (filteredData) => {
  //       console.log('Filtered Data from API:', filteredData); // Debugging API response
  //       this.data = filteredData.map((subscriberDetails) => ({
  //         id: subscriberDetails._id,
  //         subscriberId: subscriberDetails.subscriberId,
  //         subscriberName: `${subscriberDetails.firstName} ${subscriberDetails.lastName}`,
  //         subscriberProfile: subscriberDetails.profileImageUrl
  //       }));
  //       this.displayedSubscribers = this.data;
  //     },
  //     (error) => {
  //       console.error('Error fetching filtered data:', error); // Handling errors
  //     }
  //   );
  // }
  
  

  getSubscribersById(id: string): void {
    this.service.getsubscriberById(id).subscribe(
      data => {
        this.subscriberDetail = data;
  
        console.log(this.subscriberDetail)
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
  }


  
  onButtonClick(id: string): void {
    this.getSubscribersById(id);
  }


  showSubscriberList(): void {
    this.isSubscriberListVisible = true;
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

  AddSubscriberById(id: any): void {
    this.service.getsubscriberById(id).subscribe(
      res => {
        this.subscriberDetail = res;
        
        // Assuming data structure matches your grid row data structure
        const subscriberRow = {
          id: this.subscriberDetail.Subscriber._id,
          subscriberId: this.subscriberDetail.Subscriber.subscriberId,
          name: `${this.subscriberDetail.Subscriber.firstName} ${this.subscriberDetail.Subscriber.lastName}`,
          subscriberProfile: this.subscriberDetail.Subscriber.profileImageUrl,
          aliasName: this.subscriberDetail.Subscriber.aliasName,
          place: this.subscriberDetail.Subscriber.place,
          occupation: this.subscriberDetail.Subscriber.occupation
          // Add other necessary fields here
        };
  
        // Add the new subscriber to the grid data
        this.data = [subscriberRow];
        
        // Trigger grid update
        this.gridApi.setRowData(this.data);
  
        console.log('Subscriber added to the grid:', this.subscriberDetail);
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
  }
  
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  addToGroup(id: any): void {
    
    this.AddSubscriberById(id);
    // this.service.getsubscriberAll().subscribe((data)=>{
    //   this.subscriberData=data;
    // })
  }
}
