import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import { Router } from '@angular/router';
// import { SubscriberDetails } from '../shared/interface/chit';

@Component({
  selector: 'app-chit-create',
  templateUrl: './chit-create.component.html',
  styleUrl: './chit-create.component.css'
})
export class ChitCreateComponent {
  addTicketId:any=1
  errorMessage: string = '';
  ticketId:any=1
  breadcrumsData: any = [
    {
      key: 'Chit Management',
      routerLink: '/chit',
    },
    {
      key: 'Create New Group',
      routerLink: '/chit/create',
    },
  ];
  showList = false;
  listId:any
  modalErrorMessage: string = '';
  currentListType: 'chit' | 'additional' = 'chit';
  gridApi: any;
  data : any[] = [];
  chitdata :any;
  subscriberDetail: any;
  subscriberData:any={}
  subData:any={}
  addSubData:any={}
  chitSubscribersData = [];
  addChitSubscribersData = [];
  displayedSubscribers: any[];
  isSubscriberListVisible:boolean = false;
  searchInput:string=""
  chitGroupForm:FormGroup
  displayedChits: any[];
  constructor( private subService:SubscriberService, private chitService:ChitService, private router:Router,) {

  }

  ngOnInit(): void{
    this.chitGroupForm = new FormGroup({
      auctionDate: new FormControl(''),
      chitAmount: new FormControl(''),
      foremanCommission: new FormControl(''),
      monthlyInstall: new FormControl(''),
      document: new FormControl(''),
      chitSubscribers: new FormControl([]),
      addChitSubscribers: new FormControl([])
    });


    this.subService.getsubscriberAll().subscribe((data)=>{
      this.subscriberData=data;
      console.log("subscriber data",this.subscriberData);
     
      this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
        id:subscriberDetails?._id,
        subscriberId: subscriberDetails?.subscriberId,
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
        subscriberProfile:subscriberDetails?.profileImageUrl
      }))
      this.displayedSubscribers = this.data;
      console.log(this.displayedSubscribers);
      
    })
  }
  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    const ticketId = params.data.ticketId; // Incrementing the ticket ID starting from 1
    console.log(ticketId,"tickid");
  
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="35" height="35" style="border-radius: 50%; margin-right: 10px;">
        <span style="color: #50A1A5;"></span>
      </div>
    `;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.chitGroupForm.patchValue({ document: file.name });
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

  getSubscribersById(id: string): void {
    this.subService.getsubscriberById(id).subscribe(
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
    this.listId=id

    if (this.subscriberDetail && this.subscriberDetail.id === id) {
      // If the same subscriber is clicked, toggle off the details
      this.subscriberDetail = null;
    } else {
      this.subscriberDetail = this.displayedSubscribers.find(sub => sub.id === id);
    }
  }


  showSubscriberList(type: 'chit' | 'additional'): void {
    this.currentListType = type;
    this.isSubscriberListVisible = true;
    this.subService.getsubscriberAll().subscribe((data)=>{
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
  
  addSelectedSubscriber(subscriber: any): void {
 
    if(this.listId==subscriber)
    {
      if (this.currentListType === 'chit') {
        this.addSubscriberById(subscriber);
      } else {
        this.addAdditionalSubscriberById(subscriber);
      }
  
    }
    // this.closeSubscriberList();
    this.subscriberDetail=null

  }


  addSubscriberById(id: string): void {
    if(this.ticketId <= 20)
    {
      const chitSubscribers = this.chitGroupForm.get('chitSubscribers').value || [];
      this.ticketId=chitSubscribers.length+1
      if (chitSubscribers.length >= 20) {
        this.showModal('Cannot add more than 20 subscribers.');
        return;
      }
  
      this.subService.getsubscriberById(id).subscribe(
        res => {
          this.subData = res;
  
          const newSubscriber = {
            ticketId: this.ticketId,
            subscriberId: this.subData.Subscriber.subscriberId,
            profileImageUrl: this.subData.Subscriber.profileImageUrl,
            aliasName: this.subData.Subscriber.lastName,
            firstName: this.subData.Subscriber.firstName,
            place: this.subData.Subscriber.routeId,
            occupation: this.subData.Subscriber.occupation
          };
  
          if (chitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId)) {
            this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
            return;
          }
  
          chitSubscribers.push(newSubscriber);
          this.chitGroupForm.patchValue({ chitSubscribers });
  
          // Update the table data
          this.chitSubscribersData = [...chitSubscribers];
        },
        error => {
          if (error.status === 400 && error.error.message.includes('Duplicate subscriberId')) {
            this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
          } else {
            console.error('Error fetching subscriber:', error);
          }
        }
      );
     }
  }

  column: ITableColumn[] = [
    { label: 'profileImageUrl', field: 'Ticket Id', sortable: false ,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'TicketId', field: 'ticketId', sortable: true },

    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true }
  ];  

  addSubcolumn: ITableColumn[] = [
    { label: 'Ticket Id', field: 'profileImageUrl', sortable: false ,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'TicketId', field: 'ticketId', sortable: true },
    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true }
  ];

 

  addAdditionalSubscriberById(id: string): void {
    if (this.ticketId > 20) {
      const addChitSubscribers = this.chitGroupForm.get('addChitSubscribers').value || [];
      const chitSubscribers = this.chitGroupForm.get('chitSubscribers').value || [];
  
      if (addChitSubscribers.length >= 5) {
        this.showModal('Cannot add more than 5 additional subscribers.');
        return;
      }
  
      this.subService.getsubscriberById(id).subscribe(
        res => {
          this.addSubData = res;
  
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
          if (addChitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId) ||
              chitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId)) {
            this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
            return;
          }
          this.ticketId += 1;

          addChitSubscribers.push(newSubscriber);
          this.chitGroupForm.patchValue({ addChitSubscribers });
  
          // Update the table data
          this.addChitSubscribersData = [...addChitSubscribers];
        },
        error => {
          console.error('Error fetching subscriber:', error);
        }
      );
    }
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
  
  
  
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  addToGroup(id: any): void {
    
    this.addSubscriberById(id);
    // this.service.getsubscriberAll().subscribe((data)=>{
    //   this.subscriberData=data;
    // })
  }
  onSubmit(): void {
    const payload = this.chitGroupForm.value
    
    this.chitService.saveChitDetails(payload).subscribe((data) => {
      console.log(data);
    });

    if (this.chitGroupForm.valid) {
      console.log('Form submitted:', this.chitGroupForm.value);
      // Submit the form data to your backend or process it as needed
    } else {
      console.warn('Form is invalid.');
    }
    this.router.navigate(["/chit"]);



  }
}
