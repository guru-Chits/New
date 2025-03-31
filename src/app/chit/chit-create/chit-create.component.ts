import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ITableColumn } from '../../shared/interface/list-table';
import { SubscriberService } from '../../subscriber/shared/service/subscriber.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChitService } from '../shared/service/chit.service';
import { Router } from '@angular/router';
import { ServiceService } from '../../settings/shared/service.service';
import { PaymentService } from '../../payments/shared/service/payment.service';
// import { SubscriberDetails } from '../shared/interface/chit';

@Component({
  selector: 'app-chit-create',
  templateUrl: './chit-create.component.html',
  styleUrl: './chit-create.component.css',
})
export class ChitCreateComponent {
  errorMessage: string = '';
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
  listId: any;
  showall = false; // To toggle "View More"

  modalErrorMessage: string = '';
  currentListType: 'chit' | 'additional' = 'chit';
  gridApi: any;
  data: any[] = [];
  chitdata: any;
  subscriberDetail: any;
  subscriberData: any = {};
  subData: any = {};
  addSubData: any = {};
  chitSubscribersData = [];
  displayedSubscribers: any[];
  selectedSubscriberId: string;
  itemsPerPage = 10; // Subscribers per page
  isSubscriberListVisible: boolean = false;
  searchInput: string = '';
  chitGroupForm: FormGroup;
  displayedChits: any[];
  currentDate: any;
  selectedFileName: string = '';
  chitSubLength: any;
  collectionTypes: any;
  collectionTypeForm: FormGroup;
  minDate: string;
  maxDate: string;
  minDay = 1;
  walletBalance: number;
  futureDate: Date; // Format: YYYY-MM-DDTHH:MM (ISO 8601)  groupId:string
  maxDay = 10;
  constructor(
    private subService: SubscriberService,
    private chitService: ChitService,
    private router: Router,
    private settings: ServiceService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.chitGroupForm = new FormGroup({
      auctionDate: new FormControl('', [Validators.required]),
      chitAmount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      foremanCommission: new FormControl('', [Validators.required]),
      monthlyInstall: new FormControl('', [Validators.required]),
      document: new FormControl(''),
      chitSubscribers: new FormControl([]),
      addChitSubscribers: new FormControl([]),
    });
    this.collectionTypeForm = new FormGroup({
      collectionType: new FormControl('', [Validators.required]),
    });

    // const today = new Date().toISOString().split('T')[0];
    // this.currentDate = today;
    // const FirstChitDate = new Date()
    // const year = FirstChitDate.getFullYear();
    // const month = FirstChitDate.getMonth() + 1; // Month is zero-based, add 1
    // // Set minimum date to the first day of the current year
    // this.minDate = `${year}-01-01`;

    // // Set maximum date to the end of the year
    // this.maxDate = `${year}-12-31`;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is 0-indexed

    // Set the min date to the 1st of the current month
    this.minDate = `${year}-${String(month).padStart(2, '0')}-01`;
    // Set the max date to the 10th of the current month
    this.maxDate = `${year}-${String(month).padStart(2, '0')}-10`;

    this.subService.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      this.data = this.subscriberData.AllSubscriber.map(
        (subscriberDetails, index) => ({
          id: subscriberDetails?._id,
          subscriberId: subscriberDetails?.subscriberId,
          subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
          subscriberProfile: subscriberDetails?.profileImageUrl,
        })
      );
      this.displayedSubscribers = this.data.slice(0, this.itemsPerPage);
    });
  }
  // Method to trigger the hidden file input
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  addSelectedSubscriber(subscriber: any): void {
    if (this.listId == subscriber) {
      if (this.currentListType === 'chit') {
        this.addSubscriberById(subscriber);
      }
    }
    // this.closeSubscriberList();
    this.subscriberDetail = null;
  }
  // Method to handle the file selection and display the file name
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0]; // Get the selected file
      this.selectedFileName = file.name; // Set the file name
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
    console.log("params_data",params.data)

    // return `
    //   <div style="display: flex; align-items: center;">
    //     <img src="${imageUrl}" alt="Profile Image" width="35" height="35" style="border-radius: 50%; margin-right: 10px;">
    //     <span style="color: #50A1A5;"></span>
    //   </div>
    // `;
    const subscribeName = params.data.firstName
    console.log("hjjjjjjjjjjjjjjjjjjjjj",subscribeName)
    const firstLetter = subscribeName.charAt(0).toUpperCase(); // Get first letter
    if (imageUrl) {
      // If image exists, return the image tag
      return `
        <div style="display: flex; align-items: center;">
          <img src="${imageUrl}" alt="Profile Image" width="32" height="32" 
               style="border-radius: 50%; object-fit: cover;">
        </div>
      `;
    } 
    else 
    {
      // If no image, return first letter inside a styled div
      return `
        <div style="
          width: 32px; height: 32px; 
          border-radius: 50%; 
          background-color: #007bff; 
          color: white; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          font-size: 14px; 
          font-weight: bold;
        ">
          ${firstLetter}
        </div>
      `;
      }
  }

  getformanVal() {
    const chitAmount = this.chitGroupForm.get('chitAmount').value;
    const forman = chitAmount * 0.05;
    this.chitGroupForm.get('foremanCommission').patchValue(forman);
    this.chitGroupForm.get('monthlyInstall').patchValue(forman);
  }

  onSelectedFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.chitGroupForm.patchValue({ document: file.name });
    }
  }
  applyFilter(filterValue: string) {
    const filteredSubscribers = this.data.filter((subscriber) => {
      const subscriberId =
        subscriber.subscriberId?.toString().toLowerCase() || '';
      const subscriberName = subscriber.subscriberName?.toLowerCase() || '';
      const email = subscriber.email?.toLowerCase() || '';
      return (
        subscriberId.includes(filterValue.toLowerCase()) ||
        subscriberName.includes(filterValue.toLowerCase()) ||
        email.includes(filterValue.toLowerCase())
      );
    });

    this.displayedSubscribers = filteredSubscribers.slice(0, this.itemsPerPage);
  }

  getSubscribersById(id: string): void {
    this.subService.getsubscriberById(id).subscribe(
      (data) => {
        this.subscriberDetail = data;
        this.selectedSubscriberId =
          this.subscriberDetail.Subscriber.subscriberId;
      },
      (error) => {
        console.error('Error fetching subscriber', error);
      }
    );
  }

  onButtonClick(id: string): void {
    this.getSubscribersById(id);
    this.collectionTypeForm.reset();
    this.listId = id;
    this.settings.getAllCollection().subscribe((data) => {
      this.collectionTypes = data;
      this.collectionTypes = this.collectionTypes.res;
    });
    if (this.subscriberDetail && this.subscriberDetail.id === id) {
      // If the same subscriber is clicked, toggle off the details
      this.subscriberDetail = null;
    } else {
      this.subscriberDetail = this.displayedSubscribers.find(
        (sub) => sub.id === id
      );
    }
  }

  showSubscriberList(type: 'chit' | 'additional'): void {
    this.currentListType = type;
    this.isSubscriberListVisible = true;
    this.subService.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;
      this.data = this.subscriberData.AllSubscriber.map(
        (subscriberDetails, index) => ({
          id: subscriberDetails?._id,
          subscriberId: subscriberDetails?.subscriberId,
          subscriberName: `${subscriberDetails?.firstName} ${subscriberDetails?.lastName}`,
          subscriberProfile: subscriberDetails?.profileImageUrl,
        })
      );
      this.displayedSubscribers = this.data;
      console.log("displayedSubscribersssssssssssss",this.displayedSubscribers)
    });
  }

  viewMore() {
    if (!this.showall) {
      this.displayedSubscribers = this.data; // Show all subscribers
      this.showall = true;
    }
  }
  addSubscriberById(id: string): void {
    const chitSubscribers =
      this.chitGroupForm.get('chitSubscribers').value || [];
    if (chitSubscribers.length >= 25) {
      this.showModal('Cannot add more than 25 subscribers.');
      return;
    }

    this.subService.getsubscriberById(id).subscribe(
      (res) => {
        this.subData = res;
        console.log("subData detailssssssssssssssss",this.subData)
        const newSubscriber = {
          subscriberId: this.subData.Subscriber.subscriberId,
          profileImageUrl: this.subData.Subscriber.profileImageUrl,
          aliasName: this.subData.Subscriber.lastName,
          firstName: this.subData.Subscriber.firstName,
          place: this.subData.Subscriber.routeId,
          occupation: this.subData.Subscriber.occupation,
          collectionType: this.collectionTypeForm.get('collectionType')?.value,
          subId: this.subData.Subscriber._id
        };
        console.log("newsubscribers...",newSubscriber)
        if (
          chitSubscribers.some(
            (sub) => sub.subscriberId === newSubscriber.subscriberId
          )
        ) {
          this.showModal(
            'Duplicate subscriber ID detected. This subscriber cannot be added.'
          );
          return;
        }
        chitSubscribers.push(newSubscriber);
        console.log("chitsubbbbb",newSubscriber)
        this.chitGroupForm.patchValue({ chitSubscribers });
        this.chitSubscribersData = [...chitSubscribers];
        this.chitSubLength = this.chitSubscribersData.length;
      },
      (error) => {
        if (
          error.status === 400 &&
          error.error.message.includes('Duplicate subscriberId')
        ) {
          this.showModal(
            'Duplicate subscriber ID detected. This subscriber cannot be added.'
          );
        } else {
          console.error('Error fetching subscriber:', error);
        }
      }
    );
  }
  column: ITableColumn[] = [
    {
      label: 'profileImageUrl',
      field: '',
      sortable: false,
      cellRenderer: this.profileImageWithIdRenderer,
    },
    { label: 'Alias Name', field: 'aliasName', sortable: true },
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Place', field: 'place', sortable: true },
    { label: 'Occupation', field: 'occupation', sortable: true },
    { label: 'Collection Type', field: 'collectionType', sortable: true },
  ];

  showModal(message: string): void {
    this.modalErrorMessage = message;
    const modal = document.getElementById('duplicateModal');
    modal.style.display = 'block';
  }

  closeModal(): void {
    const modal = document.getElementById('duplicateModal');
    modal.style.display = 'none';
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  addToGroup(id: any): void {
    this.addSubscriberById(id);
  }
  onSubmit(): void {
    const payload = this.chitGroupForm.value;

    this.chitService.saveChitDetails(payload).subscribe((data) => {
      const groupId = data.newChitGroup.chitGroupId;
      this.walletBalance = data.newChitGroup.chitAmount;
      this.futureDate = data.newChitGroup.auctionDate;

      // Debug logs
      console.log('groupId:', groupId);
      console.log('walletBalance:', this.walletBalance);
      console.log('auctionDateString:', this.futureDate);

      // if (this.walletBalance !== null) {
      //   this.paymentService
      //     .saveTransactionDetails(groupId, this.walletBalance, this.futureDate)
      //     .subscribe(
      //       (response) => {
      //         console.log('Transaction response:', response);
      //         // alert(response.message);
      //       },
      //       (error) => {
      //         console.error('Error:', error);
      //         // alert('Failed to schedule or process the transaction');
      //       }
      //     );
      // } else {
      //   // alert('Please provide the necessary details.');
      // }
    });

    if (this.chitGroupForm.valid) {
    } else {
      console.warn('Form is invalid.');
    }
    setTimeout(() => {
      this.router.navigate(['/chit']);
    }, 1 * 1000); // 3 minutes = 180,000 milliseconds

  }

  validateDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let selectedDate = new Date(input.value);

    if (selectedDate.getDate() < 1) {
      selectedDate.setDate(1);
    } else if (selectedDate.getDate() > 10) {
      selectedDate.setDate(10);
    }

    // Update the input value if changed
    input.value = this.formatDate(selectedDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isSubscriberInChit(subscriberId: string): boolean {
    return this.chitSubscribersData.some(
      (chitSubscriber) => chitSubscriber.subscriberId === subscriberId
    );
  }
  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}
