import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,FormBuilder,ValidatorFn, Validators } from '@angular/forms';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { AreaService } from '../shared/service/area.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableColumn } from '../../shared/interface/list-table';
import { AuthService } from '../../shared/service/auth.service';
@Component({
  selector: 'app-area-create',
  templateUrl: './area-create.component.html',
  styleUrl: './area-create.component.css'
})
export class AreaCreateComponent implements OnInit{
  routeForm : FormGroup
  regionIdList: any
  routeData:any
  routeDetail: any;
  editData:any
  totalCount:any;
  route:any=true;
  id:any
  data: any[] = [];
  displayedRoute:any
  buttonTxt:string="Submit"
  selectedRegionId: String =''
  filter:boolean=true
  selectedRouteName: String =''
  selectedRegionName: String=''
  generatedRouteID: String=''
 search:boolean=true
 searchImg:string='assets/table/search.svg'
 filterImg:string='assets/table/filter.svg'
 itemsToShow: number = 10;     // Number of items to display initially and after each load


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
  canView:boolean=false
  canCreate:boolean=false
  canDelete:boolean=false
  canEdit:boolean=false

  constructor( private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private service: AreaService,
    private router:Router,
    private authService:AuthService

  ) { }
  ngOnInit(): void{
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

    this.routeForm = new FormGroup({
      regionId: new FormControl(null, [
        Validators.required,
        // Validators.pattern('^[A-Z]{3}$') // Exactly 3 capital letters
      ]),
      routeName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]*$') // First letter capitalized, no spaces at beginning or end, only alphabetic characters
      ]),

      routeId: new FormControl(null, [
        Validators.required,
        // Validators.pattern('^[A-Z]{3} - [A-Z][a-zA-Z]*$') // "Region ID - Area Name" format
      ]),
      routeDesc: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        // Validators.maxLength(100),
        // Validators.pattern('^[a-zA-Z0-9 ,.!?-]+$') // Valid characters including letters, numbers, and common punctuation
        Validators.maxLength(100),
       // Valid characters including letters, numbers, and common punctuation
      ]),
      status: new FormControl(true),
    })
    this.getrouteAll()
 
    // get regionID list
    this.service.getregionAll().subscribe((data:any) => {
      console.log(data);
      // this.regionIdList = data.AllRegion;
      this.regionIdList = data.AllRegion.filter((region: any) => region.status === true);

      console.log("regionlist",this.regionIdList)
    })
    

    this.activatedRoute.params.subscribe(paramData => {
      console.log("ObjectKeys =>",Object.keys(paramData))
      console.log("ParamData =>", paramData)
      if (Object.keys(paramData).length) {
        this.breadcrumsData  = [
          {
            key: 'Route Manager',
            routerLink: 'area',
          },
          {
            key: 'Edit Route',
            routerLink: `/area/routeedit/${paramData.id}`,
          },
        ];
        this.buttonTxt="Save Changes"
        this.service.getrouteById(paramData.id).subscribe((data) => {
          this.editData = data;
          console.log(this.editData);
          
          this.id=this.editData.Route._id
          console.log(this.id);
          
           const updatedRoute = { ...this.editData.Route};
            this.routeForm.patchValue(updatedRoute);
    
          })
      }
      this.getrouteAll()    


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
      action: "view Details",
      status: routeDetails.status ? 'Active' : 'InActive'
    
      }));
       // Initially display only the first 'itemsToShow' records
       this.displayedRoute = this.data.slice(0, this.itemsToShow);
       console.log("Initial displayed data", this.displayedRoute);
      // this.displayedRoute = this.data;
      // console.log(this.displayedRoute);
      

      });
    }
    loadMore(): void {
        // Increase the number of items to display by 10
        this.itemsToShow += 10;
    
        // Update the displayedRegion with the newly added data
        this.displayedRoute = this.data.slice(0, this.itemsToShow);
        console.log("Loaded more data", this.displayedRoute);
    }
    
  
  edit(id: any){
    console.log(id);
    this.router.navigate([`area/routeedit/${id}`]);
    }

  
    // patch module name to the form
    onModuleChange(){
      console.log("selected regionId", this.selectedRegionId);
      const region = this.regionIdList.find((module) => module._id === this.selectedRegionId);
      if(region){
        this.selectedRegionName = region.regionId
        // this.routeForm.get('routeName').patchValue("");
        this.routeForm.get('routeId').patchValue("");
        this.getRouteNameValue()
      }
      console.log("route form", this.routeForm);
      
    }
    getRouteNameValue() {
      const region = this.regionIdList.find((module) => module._id === this.selectedRegionId);
      if(region){
        this.selectedRegionName = region.regionId
      }
      const routeNameValue = this.routeForm.get('routeName').value;
      const regionId = this.routeForm.get('regionId').value;
      console.log('form region id:', regionId);

      
      console.log('Route Name:', routeNameValue);
      this.selectedRouteName = routeNameValue
      this.generatedRouteID= `${this.selectedRegionName}-${this.selectedRouteName}`;
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
      this.service.saverouteDetails(payload, this.id).subscribe((data) => {
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
        filterList:false,
       
      },
    
      { label: 'Route ID', field:'routeId', sortable: true,
        filterList:false,      cellStyle: { color: '#50A1A5' },

        
       },
      { label: 'Region Name', field: 'regionName', sortable: true , filterList:true,
    
          },
      { label: 'Route Name', field: 'routeName', sortable: true , filterList:true,
      
        },      
      { label: '', field: 'action', sortable: true , filterList:true,      cellStyle: { color: '#50A1A5', cursor:'pointer' },

        onCellClicked: (event: CellClickedEvent) =>
          this.getrouteById(event.data.id)
          },
      { label: 'Status', field: 'status', sortable: true , filterList:true,
      },

      
    ];
  
    applyFilter(filterValue: string) {
      if (!filterValue || !this.data) {
        this.displayedRoute = this.data; // Show all if there's no filter or data is not defined
        return;
      }
    
      this.displayedRoute = this.data.filter(route => {
        const routeId = route.routeId ? route.routeId.toString().toLowerCase() : '';
        const regionName = route.regionName ? route.regionName .toLowerCase() : '';
        const routeName = route.routeName ? route.routeName .toLowerCase() : '';

        return routeId.includes(filterValue.toLowerCase()) || regionName.includes(filterValue.toLowerCase());
      });
    }
  delete(id:any){

  }
}
