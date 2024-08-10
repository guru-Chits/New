import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, ValidatorFn, Validators  } from '@angular/forms';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../shared/service/area.service';
import { ITableColumn } from '../../shared/interface/list-table';


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
  data: any[] = [];
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
  
  ) { }
  ngOnInit(): void{
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
        Validators.minLength(10),
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z0-9 ,.!?-]+$') // Valid characters including letters, numbers, and common punctuation
      ]),
      status: new FormControl(null) // Assuming you might add validation later or leave as is
    });

    this.getAllRegion()

  this.activatedRoute.params.subscribe(paramData => {
    console.log("ObjectKeys =>",Object.keys(paramData))
    console.log("ParamData =>", paramData)
    if (Object.keys(paramData).length) {
      this.breadcrumsData  = [
        {
          key: 'area Management',
          routerLink: '/route',
        },
        {
          key: 'Edit Subscriber',
          routerLink: `route/edit/${paramData.id}`,
        },
       
      
      ];
      // this.heading="Edit Subscriber Details"

    }
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
})
  }

  onSubmit(): void {
    // const formData = new FormData();
    // const formValue = this.regionForm.getRawValue();
      const payload = this.regionForm.value
    // for (const key in formValue) {
    //   if (formValue.hasOwnProperty(key)) {
    //     formData.append(key, formValue[key]);
    //   }
    // }

    this.service.saveregionDetails(payload, this.regionId).subscribe((data) => {
      console.log(data);

      this.getAllRegion()

      // this.router.navigate(["/route"]);
    });
    this.regionForm.reset()
    
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
 

  column: ITableColumn[] = [
    {
      label: 'S No',
      field: 'routeNo',
      filter:false,
     
    },
  
    { label: 'Region ID', field:'regionId', sortable: true,
      filter:false,
      
     },
    { label: 'Region Name', field: 'regionName', sortable: true , filter:true,
  
        },
    { label: '', field: 'action', sortable: true , filter:true,
      onCellClicked: (event: CellClickedEvent) =>
        this.getregionById(event.data.id)
        },
    
  ];
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
