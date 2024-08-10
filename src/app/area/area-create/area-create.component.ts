import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,FormBuilder,ValidatorFn, Validators } from '@angular/forms';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { AreaService } from '../shared/service/area.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
@Component({
  selector: 'app-area-create',
  templateUrl: './area-create.component.html',
  styleUrl: './area-create.component.css'
})
export class AreaCreateComponent implements OnInit{
  routeForm : FormGroup
  regionIdList: any
  routeData:any
  routeId:string
  routeDetail: any;
  totalCount:any;
  route:any=true;
  data: any[] = [];
  
  selectedRegionId: String =''
  selectedRouteName: String =''
  selectedRegionName: String=''
  generatedRouteID: String=''

  breadcrumsData:any = [
    {
      key: 'Route Manager',
      routerLink: '/area',
    },
    {
      key: 'Create New Route',
      routerLink: 'area/areacreate',
    },
  ];
  constructor( private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private service: AreaService,
    private router:Router,
  
  ) { }
  ngOnInit(): void{
    this.routeForm = new FormGroup({
      regionId: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z]{3}$') // Exactly 3 capital letters
      ]),
      routeName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]*$') // First letter capitalized, no spaces at beginning or end, only alphabetic characters
      ]),
      regionName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]*$') // First letter capital, rest alphabetic
      ]),
      routeId: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z]{3} - [A-Z][a-zA-Z]*$') // "Region ID - Area Name" format
      ]),
      routeDesc: new FormControl(null, [
        Validators.minLength(10),
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z0-9 ,.!?-]+$') // Valid characters including letters, numbers, and common punctuation
      ]),
      status: new FormControl(null),
    })
    this.getrouteAll()
 
    // get regionID list
    this.service.getregionAll().subscribe((data:any) => {
      console.log(data);
      this.regionIdList = data.AllRegion;
      console.log("regionlist",this.regionIdList)
    })

    this.activatedRoute.params.subscribe(paramData => {
      console.log("ObjectKeys =>",Object.keys(paramData))
      console.log("ParamData =>", paramData)
      if (Object.keys(paramData).length) {
        this.breadcrumsData  = [
          {
            key: 'area Management',
            routerLink: '/areacreate',
          },
          {
            key: 'Edit Subscriber',
            routerLink: `areacreate/edit/${paramData.id}`,
          },
         
        
        ];
        // this.heading="Edit Subscriber Details"
  
      }
    })
      
  }
  getrouteAll(): void{
      console.log("region data");
      
      this.service.getrouteAll().subscribe((data)=>{
    this.routeData=data;
    console.log("kk",this.routeData)
  
  
    this.totalCount=this.routeData.AllRoute.length
    this.data=this.routeData.AllRoute.map((routeDetails,index)=>({
      id:routeDetails?._id,
      regionId: routeDetails?.regionId,
      regionName: routeDetails?.regionName,
      routeId: routeDetails?.routeId,
      routeName:routeDetails?.routeName,
      routeNo: index + 1,
      action: "view Details"
    
      }))
      })
    
  }
  
    // patch module name to the form
    onModuleChange(){
      console.log("selected regionId", this.selectedRegionId);
      const region = this.regionIdList.find((module) => module._id === this.selectedRegionId);
      if(region){
        this.selectedRegionName = region.regionName
      }
      console.log("route form", this.routeForm);
      
    }
    getRouteNameValue() {
      const routeNameValue = this.routeForm.get('routeName').value;
      
      console.log('Route Name:', routeNameValue);
      this.selectedRouteName = routeNameValue
      this.generatedRouteID= `${this.selectedRegionName}_${this.selectedRouteName}`;
      console.log("generatedID",this.generatedRouteID)

      this.routeForm.get('routeId').patchValue(this.generatedRouteID);
      // return routeNameValue;
    }
  
    onSubmit(): void {
     
      
      const formValues = this.routeForm.value
      const payload = {
        regionId: formValues.regionId,
        routeName: formValues.routeName,
        regionName: this.selectedRegionName, // Use the predefined regionName here
        routeId: formValues.routeId,
        routeDesc: formValues.routeDesc,
        status: formValues.status,
      };
      this.service.saverouteDetails(payload, this.routeId).subscribe((data) => {
        console.log(data);
  
        this.getrouteAll()
  
        // this.router.navigate(["/route"]);
      });
      this.routeForm.reset()
      
    }
  
    getrouteById(id: string): void {
      this.service.getrouteById(id).subscribe(
        data => {
          this.routeDetail = data;
    
          console.log("region",this.routeDetail)
        },
        error => {
          console.error('Error fetching subscriber', error);
        }
      );
    }
   
  
  column: ITableColumn[] = [
      {
        label: 'S No',
        field: 'routeNo',
        filter:false,
       
      },
    
      { label: 'Route ID', field:'routeId', sortable: true,
        filter:false,
        
       },
      { label: 'Region Name', field: 'regionName', sortable: true , filter:true,
    
          },
      { label: 'Route Name', field: 'routeName', sortable: true , filter:true,
      
        },      
      { label: '', field: 'action', sortable: true , filter:true,
        onCellClicked: (event: CellClickedEvent) =>
          this.getrouteById(event.data.id)
          },
      
    ];
  
}
//   columns: ColDef[] = [
//     { field: 'sno', headerName: 'S No.', sortable: true },
//     { field: 'routeId', headerName: 'Route ID', sortable: true },
//     { field: 'regionName', headerName: 'Region Name', sortable: true },
//     { field: 'routeName', headerName: 'Route Name', sortable: true },
//     { field: 'status', headerName: '', sortable: true }
//   ];

//   rowData = [
//     { sno: '1', routeId: 'CMB', regionName: 'Coimbatora', routeName: "Gandhipuram", status: 'View Details' },
//     { sno: '2', routeId: 'CHN', regionName: 'Chennai', routeName: "Gandhipuram", status: 'View Details' },
//     { sno: '3', routeId: 'BNG', regionName: 'Banglore', routeName: "Gandhipuram", status: 'View Details' },
//     { sno: '4', routeId: 'MAD', regionName: 'Madurai', routeName: "Gandhipuram", status: 'View Details' },
//     { sno: '5', routeId: 'TRY', regionName: 'Trichy', routeName: "Gandhipuram", status: 'View Details' },
//     { sno: '6', routeId: 'TVL', regionName: 'Tirunelveli', routeName: "Gandhipuram", status: 'View Details' },
//     { sno: '7', routeId: 'THU', regionName: 'Thoothukudi', routeName: "Gandhipuram", status: 'View Details' },

//  ]

