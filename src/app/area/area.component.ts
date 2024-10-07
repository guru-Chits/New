import { Component } from '@angular/core';
import {CellClickedEvent, ColDef } from 'ag-grid-community';
import { AreaService } from './shared/service/area.service';
import {ITableColumn} from '../../app/shared/interface/list-table'
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.css'
})
export class AreaComponent {
areaData:any
data: any[] = [];
selectedId:any
uniqueRegions: string[];
areaDetail:any
totalCount:number;
filter:false;
  searchImg:string='assets/table/search.svg'
  // filterImg:string='assets/table/filter.svg'
   search:boolean=true
  constructor(
    private service:AreaService,
    private router:Router,
    private authService:AuthService

  ) { }
  canView:boolean=false
  canCreate:boolean=false
  canDelete:boolean=false
  canEdit:boolean=false
  breadcrumsData:any = [
    {
      key: 'Route Manager',
      routerLink: '/area',
    },
  ];
  ngOnInit(): void {
    this.authService.checkAccess('Route Manager', 'view').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
      }
    });

    this.authService.checkAccess('Route Manager', 'create').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canCreate=true
      }
    });


    this.authService.checkAccess('Route Manager', 'delete').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canDelete=true
      } 
    });

    this.authService.checkAccess('Route Manager', 'edit').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canEdit=true
      } 
    });

    this.service.getrouteAll().subscribe((data)=>{
    this.areaData=data;
    console.log("kk",this.areaData)

    
    this.totalCount=this.areaData.AllRoute.length
    this.data=this.areaData.AllRoute.map((areaDetails,index)=>({
      id:areaDetails?._id,
      regionName:areaDetails?.regionName,
      routeId: areaDetails?.routeId,
      routeName: areaDetails?.routeName,
      routeNo: index + 1,
      action: "View Details"
      
    }))
    this.uniqueRegions = [...new Set(this.data.map(item => item.regionName))];
  })

 
}
getrouteById(id: string): void {
  this.service.getrouteById(id).subscribe(
    data => {
      this.areaDetail = data;

      console.log(this.areaDetail)
    },
    error => {
      console.error('Error fetching subscriber', error);
    }
  );
}

getDataByRegion(region: string) {
  return this.data.filter(item => item.regionName === region);
}

column: ITableColumn[] = [
  {
    label: 'Route No',
    field: 'routeNo',
    filterList:false,
   
  },

  { label: 'Route ID', field:'routeId', sortable: true,
    filterList:false, cellStyle: { color: '#50A1A5' },
    
   },
  { label: 'Route Name', field: 'routeName', sortable: true , filterList:false,

      },
  { label: '', field: 'action', sortable: true ,cellStyle: { color: '#50A1A5', cursor:'pointer'} ,
    onCellClicked: (event: CellClickedEvent) =>
      this.getrouteById(event.data.id)
  },
  
];

edit(id: any){
  console.log(id);
  this.router.navigate([`area/routeedit/${id}`]);
  }

//   columns: ColDef[] = [
//     { field: 'sno', headerName: 'S No.', sortable: true },
//     { field: 'regionId', headerName: 'Region ID', sortable: true },
//     { field: 'regionName', headerName: 'Region Name', sortable: true },
//     { field: 'status', headerName: '', sortable: true }
//   ];

//   rowData = [
//     { sno: '1', regionId: 'CMB', regionName: 'Coimbatora', status: 'View Details' },
//     { sno: '2', regionId: 'CHN', regionName: 'Chennai', status: 'View Details' },
//     { sno: '3', regionId: 'BNG', regionName: 'Banglore', status: 'View Details' },
//     { sno: '4', regionId: 'MAD', regionName: 'Madurai', status: 'View Details' },
//     { sno: '5', regionId: 'TRY', regionName: 'Trichy', status: 'View Details' },
//     { sno: '6', regionId: 'TVL', regionName: 'Tirunelveli', status: 'View Details' },
//     { sno: '7', regionId: 'THU', regionName: 'Thoothukudi', status: 'View Details' },

//  ]
}
