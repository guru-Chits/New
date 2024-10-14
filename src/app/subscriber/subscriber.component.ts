import { Component } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { SubscriberService } from './shared/service/subscriber.service';
import { ITableColumn } from '../../app/shared/interface/list-table'
import { Router } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrl: './subscriber.component.css'
})
export class SubscriberComponent {

  breadcrumsData: any = [
    {
      key: 'Subscriber Management',
      routerLink: 'subscriber',
    },
  ];
  chitGroup: any
  subscriberData: any
  data: any[] = [];
  count: number = 0
  chitGroups: any
  selectedId: any
  subscriberDetail: any
  totalCount: number;
  searchImg: string = 'assets/table/search.svg'
  filterImg: string = 'assets/table/filter.svg'
  search: boolean = true
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  canView: boolean = false
  filter: boolean = true
  constructor(
    private service: SubscriberService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Assuming you are calling checkAccess in your component
    this.authService.checkAccess('Subscriber Management', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate = true
      }
    });



    this.authService.checkAccess('Subscriber Management', 'view').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canView = true
      }
    });

    this.authService.checkAccess('Subscriber Management', 'delete').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canDelete = true
      }
    });


    this.service.getsubscriberAll().subscribe((data) => {
      this.subscriberData = data;

      this.totalCount = this.subscriberData.AllSubscriber.length
      this.data = this.subscriberData.AllSubscriber.map((subscriberDetails, index) => ({
        id: subscriberDetails?._id,
        displayName: `${subscriberDetails?.firstName} ${subscriberDetails?.aliasName}`,
        occupation: subscriberDetails?.occupation,
        subscriberId: subscriberDetails?.subscriberId,
        location: subscriberDetails?.place,
        profileImageUrl: subscriberDetails?.profileImageUrl,
        routeId: subscriberDetails?.routeId,
        enroll: this.service.getChitGroupById(subscriberDetails?.subscriberId).subscribe(
          response => {
            this.chitGroups = response;
            // Check if the chitGroup length is greater than 1
            if (this.chitGroups.length > 1) {
              // Increment the totalCount
              this.count++;
            }
          }
        )

      }))
    })



  }
  profileImageWithIdRenderer(params: any): string {
    const imageUrl = params.data.profileImageUrl;
    // const subscriberId = params.data.subscriberId;
    return `
      <div style="display: flex; align-items: center;">
        <img src="${imageUrl}" alt="Profile Image" width="32" height="32" style="border-radius: 50%; ">
      </div>
    `;
  }

  column: ITableColumn[] = [
    {
      label: ' ',
      field: ' ',
      filterList: false,
      maxWidth: 80,
      cellRenderer: this.profileImageWithIdRenderer,
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },
    {
      label: 'Subscriber ID',
      field: 'subscriberId',
      sortable: true,
      filterList: false,
      cellStyle: function (params: any) {
        return { color: '#50A1A5', cursor: 'pointer' };
      },
      onCellClicked: (event: CellClickedEvent) => this.getSubscriberById(event.data.id)
    },

    {
      label: 'Display Name', field: 'displayName', sortable: true,
      filterList: false,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
    {
      label: 'Route ID', field: 'routeId', sortable: true, filterList: true,

      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
    {
      label: 'Occupation', field: 'occupation', sortable: true, filterList: true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getSubscriberById(event.data.id)
    },
  ];

  getSubscriberById(id: string): void {
    this.service.getsubscriberById(id).subscribe(
      data => {
        this.subscriberDetail = data;
        this.service.getChitGroupById(this.subscriberDetail.Subscriber.subscriberId).subscribe(
          response => {
            this.chitGroup = response
            this.chitGroup = this.chitGroup.length
          },
        );
      },
      error => {
      }
    );
  }
  navigate(id: any) {
    this.router.navigate([`subscriber/view/${id}`]);
  }

}
