import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, ValidatorFn, Validators  } from '@angular/forms';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../shared/service/area.service';
import { ITableColumn } from '../../shared/interface/list-table';
import { AuthService } from '../../shared/service/auth.service';


@Component({
  selector: 'app-region-create',
  templateUrl: './region-create.component.html',
  styleUrl: './region-create.component.css'
})
export class RegionCreateComponent implements OnInit{
  regionForm : FormGroup
  regionData:any
  regionId:string
  regionDetail: any;
  totalCount:any;
  region:any=true;
  editData:any
  displayedRegion: any[];
  id:any
  editing:boolean=false
  buttonTxt:string="Submit"
  data: any[] = [];
  searchImg:string='assets/table/search.svg'
  filterImg:string='assets/table/filter.svg'
  search:boolean=true
  canView:boolean=false
  canCreate:boolean=false
  canDelete:boolean=false
  canEdit:boolean=false

  breadcrumsData:any = [
    {
      key: 'Route Manager',
      routerLink: '/area',
    },
    {
      key: 'Create New Region',
      routerLink: 'area/regioncreate',
    },
  ];
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
    this.regionForm = this.fb.group({
      regionName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]*$') // First letter capital, rest alphabetic
      ]),
      regionId: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z]{3}$') // Exactly 3 capital letters
      ]),
      regionDesc: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        // Validators.maxLength(100),
        // Validators.pattern('^[a-zA-Z0-9 ,.!?-]+$') // Valid characters including letters, numbers, and common punctuation
      ]),
      status: new FormControl(null) // Assuming you might add validation later or leave as is
    });

    this.activatedRoute.params.subscribe(paramData => {
      console.log("ObjectKeys =>",Object.keys(paramData))
      console.log("ParamData =>", paramData)
      if (Object.keys(paramData).length) {
        this.breadcrumsData  = [
          {
            key: 'Area Management',
            routerLink: 'area',
          },
          {
            key: 'Edit Region',
            routerLink: `area/regionEdit/${paramData.id}`,
          },
        ];
        this.buttonTxt="Save Changes"
      }
      this.service.getregionById(paramData.id).subscribe((data) => {
        this.editData = data;
        this.id=this.editData.Region._id
        console.log(this.id);
        
         const updatedRegion = { ...this.editData.Region};
          this.regionForm.patchValue(updatedRegion);
  
        })
    this.getAllRegion()    
  })
  }
  
  
  getAllRegion(): void{
    console.log("region data");
    
  this.service.getregionAll().subscribe((data)=>{
  this.regionData=data;
  console.log("kk",this.regionData)


this.totalCount=this.regionData.AllRegion.length
this.data=this.regionData.AllRegion.map((regionDetails,index)=>({
  id:regionDetails?._id,
  regionId: regionDetails?.regionId,
  regionName: regionDetails?.regionName,
  routeNo: index + 1,
  action: "view Details"
  
}))
this.displayedRegion = this.data;
console.log(this.regionData.id);


})
  }

  onSubmit(): void {
    const payload = this.regionForm.value
    
    this.service.saveregionDetails(payload, this.id).subscribe((data) => {
      console.log(data);
    });


    
    this.getAllRegion()

    this.regionForm.reset()
    
  }

  applyFilter(filterValue: string) {
    if (!filterValue || !this.data) {
      this.displayedRegion = this.data; // Show all if there's no filter or data is not defined
      return;
    }
  
    this.displayedRegion = this.data.filter(region => {
      const regionId = region.regionId ? region.regionId.toString().toLowerCase() : '';
      const regionName = region.regionName ? region.regionName .toLowerCase() : '';

      return regionId.includes(filterValue.toLowerCase()) || regionName.includes(filterValue.toLowerCase());
    });
  }

  getregionById(id: string): void {
    this.service.getregionById(id).subscribe(
      data => {
        this.regionDetail = data;
  
        console.log("region",this.regionDetail)
      },
      error => {
        console.error('Error fetching subscriber', error);
      }
    );
  }
  edit(id: any){
    console.log(id);
    this.router.navigate([`area/regionedit/${id}`]);
    this.editing=true
    }

  column: ITableColumn[] = [
    {
      label: 'S No',
      field: 'routeNo',
      filterList:false,
     
    },
  
    { label: 'Region ID', field:'regionId', sortable: true,
      filterList:false,
      cellStyle: { color: '#50A1A5' },
     },
    { label: 'Region Name', field: 'regionName', sortable: true , filterList:true,
  
        },
    { label: '', field: 'action', sortable: true , filterList:true,
      cellStyle: { color: '#50A1A5', cursor:'pointer'},
      onCellClicked: (event: CellClickedEvent) =>
        this.getregionById(event.data.id)
        },
        
    
  ];
}
