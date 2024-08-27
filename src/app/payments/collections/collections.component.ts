import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../staff/shared/service/staff.service';
import { AreaService } from '../../area/shared/service/area.service';
import { PaymentService } from '../shared/service/payment.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {
  Staffs: string[];
  Areas: string[];
  staffs: any
  data: any[] = [];
  routeData:any
  routes:any[]=[]
  routeId:any
  totalAmount:any
  collectedAmount:any
  selectedStaff:any
  collectionForm:FormGroup
  date:Date
  constructor(private formBuilder:FormBuilder,
    private staffService:StaffService,
    private routeService:AreaService,
    private service:PaymentService,
  ){}
  ngOnInit(): void {
    this.collectionForm = this.formBuilder.group({
      date: ['', [Validators.required]],
      routeId:  ['', [Validators.required]],
      selectedStaff:  ['', [Validators.required]],
      collectionAmount:  ['', [Validators.required]],
      amountCollected:  ['', [Validators.required]],
      balance:  ['', [Validators.required]],
      serialNumberCount:  ['', [Validators.required]],
      verifiedBy:  ['', [Validators.required]],
      });
      this.staffService.getstaffAll().subscribe((data)=>{
        this.staffs=data  
       this.data=this.staffs.AllStaff.map((staffDetails,index)=>({
        staffName:staffDetails.firstName
       }))
       })
       this.collectionForm.get('date')?.valueChanges.subscribe(date=>{
        this.date=date
        this.collectionForm.controls['routeId'].reset()
        this.collectionForm.controls['selectedStaff'].reset()
        this.service.getRouteByDate(this.date).subscribe(data=>{
        
          this.routeData=data
          console.log(this.routeData.region,"routedqtq");
          
          // this.routes=this.routeData
          this.routes=this.routeData.region.map((routeDetails,index)=>({
            routeId: routeDetails,  
            })
          )

          this.collectionForm.get('routeId')?.valueChanges.subscribe(routeId=>{
            this.routeId=routeId
            console.log(this.routeId);
  
  
            this.service.getStaff(date,routeId).subscribe(data=>{
              console.log(data);
              this.totalAmount=data
              this.selectedStaff=this.totalAmount.selectStaff.map((details,index)=>({
                selectStaff:details
                
              }))
  
              this.collectionForm.get('selectedStaff').valueChanges.subscribe(selectStaff=>{
                this.service.getTotal(this.date,this.routeId,selectStaff).subscribe(amount=>{
                  this.collectedAmount=amount
                  this.collectionForm.patchValue({
                    collectionAmount:this.collectedAmount.totalAmount,
                    serialNumberCount:this.collectedAmount.length
                  })                  
                })
              })
  
            })
        })
        }) 
        this.collectionForm.get('amountCollected')?.valueChanges.subscribe(amountCollected=>{
          this.collectionForm.patchValue({
            balance:this.collectedAmount.totalAmount-amountCollected,
          })
        })
        })





            
          // this.collectionForm.get('date')?.valueChanges.subscribe(date=>{
          //   this.service.getRouteByDate(date).subscribe(data=>{
            
          //     this.routeData=data
          //     // this.routes=this.routeData
          //     this.routes=this.routeData.region.map((routeDetails,index)=>({
          //       routeId: routeDetails?.region,  
          //       })
          //     )
          //   })
          // })  
  }
  onSubmit(){
     const payload=this.collectionForm.value

     this.service.saveCollectionDetails(payload).subscribe((response:any)=>{
       console.log(response);
       this.collectionForm.reset()
     })
  }
}
