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
      datetime: new FormControl(''),
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
    const subscriberId = params.data.subscriberId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="35" height="35" style="border-radius: 50%; margin-right: 10px;">
        <span style="color: #50A1A5;">${subscriberId}</span>
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
    if (this.currentListType === 'chit') {
      this.addSubscriberById(subscriber);
    } else {
      this.addAdditionalSubscriberById(subscriber);
    }
    // this.closeSubscriberList();
  }

  addSubscriberById(id: string): void {
    const chitSubscribers = this.chitGroupForm.get('chitSubscribers').value || [];

    if (chitSubscribers.length >= 20) {
      console.warn('Cannot add more than 20 subscribers.');
      return;
    }
    this.subService.getsubscriberById(id).subscribe(
      res => {
        this.subData = res;

        const newSubscriber = {
          subscriberId:  this.subData.Subscriber.subscriberID,
          profileImageUrl:this.subData.Subscriber.profileImageUrl,
          aliasName:  this.subData.Subscriber.lastName,
          firstName:  this.subData.Subscriber.firstName,
          place:  this.subData.Subscriber.place,
          occupation:this.subData.Subscriber.occupation
          // passbookNo:  this.subData.Subscriber.passbookNo
        };
       ;
        
        const chitSubscribers = this.chitGroupForm.get('chitSubscribers').value || [];

        if (chitSubscribers.length >= 20) {
          console.warn('Cannot add more than 20 subscribers.');
          return;
        }

        chitSubscribers.push(newSubscriber);
        this.chitGroupForm.patchValue({ chitSubscribers });

        // Update the table data
        this.chitSubscribersData = [...chitSubscribers];
      },
      error => {
        console.error('Error fetching subscriber:', error);
      }
    );
  }

  column: ITableColumn[] = [
    // { label: 'Subscriber ID', field: 'subscriberId', sortable: false },
    { label: 'profileImageUrl', field: 'Ticket Id', sortable: false ,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true }
  ];  

  addSubcolumn: ITableColumn[] = [
    // { label: 'Subscriber ID', field: 'subscriberId', sortable: false },
    { label: 'Ticket Id', field: 'profileImageUrl', sortable: false ,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true }
  ];

  addAdditionalSubscriberById(id: string): void {
    const addChitSubscribers = this.chitGroupForm.get('addChitSubscribers').value || [];

    if (addChitSubscribers.length >= 5) {
      console.warn('Cannot add more than 5 additional subscribers.');
      return;
    }

    this.subService.getsubscriberById(id).subscribe(
      res => {
        this.addSubData = res;

        const newSubscriber = {
          subscriberId:  this.addSubData.Subscriber.subscriberID,
          profileImageUrl:this.addSubData.Subscriber.profileImageUrl,
          aliasName:  this.addSubData.Subscriber.lastName,
          firstName:  this.addSubData.Subscriber.firstName,
          place:  this.addSubData.Subscriber.place,
          occupation:this.addSubData.Subscriber.occupation
          // passbookNo:  this.subData.Subscriber.passbookNo
        };

        const addChitSubscribers = this.chitGroupForm.get('addChitSubscribers').value || [];

        if (addChitSubscribers.length >= 5) {
          console.warn('Cannot add more than 5 additional subscribers.');
          return;
        }

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
