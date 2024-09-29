import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import { Router } from '@angular/router';
import { ServiceService } from '../../settings/shared/service.service';
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
  showall = false; // To toggle "View More"

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
  selectedSubscriberId:string
  itemsPerPage = 10; // Subscribers per page

  isSubscriberListVisible:boolean = false;
  searchInput:string=""
  chitGroupForm:FormGroup
  displayedChits: any[];
  currentDate: any;
  selectedFileName: string = '';
  chitSubLength: any;
  showAnother: any;
  collectionTypes: any;
  collectionTypeForm: FormGroup
  minDate: string;
  maxDate: string;
  constructor( private subService:SubscriberService, private chitService:ChitService, private router:Router, private settings: ServiceService) {

  }

  ngOnInit(): void{
    this.chitGroupForm = new FormGroup({
      auctionDate: new FormControl('',[Validators.required]),
      chitAmount: new FormControl('',[Validators.required, Validators.pattern('^[0-9]*$')]),
      foremanCommission: new FormControl('',[Validators.required]),
      monthlyInstall: new FormControl('',[Validators.required]),
      document: new FormControl(''),
      chitSubscribers: new FormControl([]),
      addChitSubscribers: new FormControl([])
    });
    this.collectionTypeForm = new FormGroup({
      collectionType: new FormControl(''),
    });

    this.settings.getAllCollection().subscribe(
      (data)=>{
        this.collectionTypes=data
        this.collectionTypes=this.collectionTypes.res
        console.log(this.collectionTypes,"Collection Type");
      }
    )
    const today = new Date().toISOString().split('T')[0];
    this.currentDate = today;
    const FirstChitDate = new Date()
    const year = FirstChitDate.getFullYear();
    const month = FirstChitDate.getMonth() + 1; // Month is zero-based, add 1
    this.minDate = `${year}-${month < 10 ? '0' + month : month}-01`;

    // Set the maximum date to the 10th of the current month
    this.maxDate = `${year}-${month < 10 ? '0' + month : month}-10`;
    this.subService.getsubscriberAll().subscribe((data)=>{
      this.subscriberData=data;
      console.log("subscriber data",this.subscriberData);
     
      this.data=this.subscriberData.AllSubscriber.map((subscriberDetails,index)=>({
        id:subscriberDetails?._id,
        subscriberId: subscriberDetails?.subscriberId,
        subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
        subscriberProfile:subscriberDetails?.profileImageUrl
      }))
      this.displayedSubscribers = this.data.slice(0, this.itemsPerPage);
      console.log(this.displayedSubscribers);
      
    });

    // this.chitGroupForm.get('chitAmount').valueChanges.subscribe(value => {
    //   if (value && !isNaN(value)) {
    //     const commission = value * 0.05;  // 5% of chit amount
    //     this.chitGroupForm.patchValue({
    //       foremanCommission: commission,  // Round to 2 decimal places
    //       monthlyInstall: commission  // Assume a 12-month installment plan
    //     });
    //   }
    // });
  }
  // Method to trigger the hidden file input
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Method to handle the file selection and display the file name
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0]; // Get the selected file
      this.selectedFileName = file.name; // Set the file name
      console.log('Selected file:', this.selectedFileName);

      // Optionally, patch the file to the reactive form control (if needed)
      this.chitGroupForm.patchValue({ document: file });
    }
  }
  // Prevents typing non-numeric characters
  preventNonNumeric(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow only numbers (charCode between 48 and 57 for numbers, 8 for backspace, 46 for delete)
    if ((charCode < 48 || charCode > 57) && charCode !== 8 && charCode !== 46) {
      event.preventDefault();
    }
  }

  // If pasted data or invalid input bypasses keypress, this will clean the value
  filterNonNumericInput(): void {
    const control = this.chitGroupForm.get('chitAmount');
    const value = control.value;

    // Replace any non-numeric characters
    const filteredValue = value.replace(/[^0-9]/g, '');

    // Update the form control value
    control.setValue(filteredValue);
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

  getformanVal(){
    const chitAmount  = this.chitGroupForm.get("chitAmount").value;
    const forman = chitAmount * 0.05;
    this.chitGroupForm.get('foremanCommission').patchValue(forman)
    this.chitGroupForm.get('monthlyInstall').patchValue(forman)
  }

  onSelectedFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.chitGroupForm.patchValue({ document: file.name });
    }
  }
  applyFilter(filterValue: string) {
  const filteredSubscribers = this.data.filter(subscriber => {
    const subscriberId = subscriber.subscriberId?.toString().toLowerCase() || '';
    const subscriberName = subscriber.subscriberName?.toLowerCase() || '';
    const email = subscriber.email?.toLowerCase() || '';
    return subscriberId.includes(filterValue.toLowerCase()) ||
           subscriberName.includes(filterValue.toLowerCase()) ||
           email.includes(filterValue.toLowerCase());
  });

  this.displayedSubscribers = filteredSubscribers.slice(0, this.itemsPerPage);

  } 

  getSubscribersById(id: string): void {
    this.subService.getsubscriberById(id).subscribe(
      data => {
        this.subscriberDetail = data;
        this.selectedSubscriberId = this.subscriberDetail.Subscriber.subscriberId;

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
    debugger
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
  viewMore() {
    if (!this.showall) {
      this.displayedSubscribers = this.data; // Show all subscribers
      this.showall = true;
    }
  }
  

  addSubscriberById(id: string): void {
    if(this.ticketId <= 20)
    {
      const chitSubscribers = this.chitGroupForm.get('chitSubscribers').value || [];
      console.log("CHIT SUBSCRIBER ADDED ",chitSubscribers)
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
            occupation: this.subData.Subscriber.occupation,
            collectionType:this.collectionTypeForm.get('collectionType')?.value
          };
  
          if (chitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId)) {
            this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
            return;
          }
  
          chitSubscribers.push(newSubscriber);
          this.chitGroupForm.patchValue({ chitSubscribers });
  
          // Update the table data
          this.chitSubscribersData = [...chitSubscribers];
          this.chitSubLength = this.chitSubscribersData.length;
          console.log("Length value", this.chitSubLength)
          if(this.chitSubLength >= 20){
            this.isSubscriberListVisible = false;
            this.showAnother = true
          }
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
    { label: 'profileImageUrl', field: '', sortable: false ,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'TicketId', field: 'ticketId', sortable: true },

    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true },
    { label: 'Collection Type', field: 'collectionType', sortable: true },
  ];  

  addSubcolumn: ITableColumn[] = [
    { label: 'Ticket Id', field: '', sortable: false ,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'TicketId', field: 'ticketId', sortable: true },
    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true },
    { label: 'Collection Type', field: 'collectionType', sortable: true },
  ];

 

  addAdditionalSubscriberById(id: string): void {
    if (this.ticketId >= 20) {
      debugger
      const addChitSubscribers = this.chitGroupForm.get('addChitSubscribers').value || [];
      const chitSubscribers = this.chitGroupForm.get('chitSubscribers').value || [];
  
      if (addChitSubscribers.length >= 5) {
        this.showModal('Cannot add more than 5 additional subscribers.');
        return;
      }
  
      this.subService.getsubscriberById(id).subscribe(
        res => {
          this.addSubData = res;
          this.ticketId += 1;
          const newSubscriber = {
            ticketId: this.ticketId,
            subscriberId: this.addSubData.Subscriber.subscriberId,
            profileImageUrl: this.addSubData.Subscriber.profileImageUrl,
            aliasName: this.addSubData.Subscriber.lastName,
            firstName: this.addSubData.Subscriber.firstName,
            place: this.addSubData.Subscriber.routeId,
            occupation: this.addSubData.Subscriber.occupation,
            collectionType:this.collectionTypeForm.get('collectionType')?.value
          };
  
          // Check for duplicate subscriber ID in both addChitSubscribers and chitSubscribers
          if (addChitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId) ||
              chitSubscribers.some(sub => sub.subscriberId === newSubscriber.subscriberId)) {
            this.showModal('Duplicate subscriber ID detected. This subscriber cannot be added.');
            return;
          }
          // this.ticketId += 1;

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
    else {
      console.log("EXIT __________")
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
