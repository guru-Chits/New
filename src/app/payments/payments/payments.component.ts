import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../shared/service/payment.service';
import { CommonService } from '../../../services/common.service';
import { IPaymentForm } from '../shared/interface/payment-form';
import { ITableColumn } from '../../shared/interface/list-table';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  Staffs: string[];

  paymentForm: FormGroup<IPaymentForm>;
  paymentData: any = {};  

  data: any[] = [];

  accessPrivData: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PaymentService,
    private commonservice : CommonService) { }

  ngOnInit(): void {
    // this.paymentForm = this.formBuilder.group({
    //   serialNum:['', [Validators.required]],
    //   receiptNumb:[''],
    //   passbookNum:['', [Validators.required]],
    //   groupId:['', [Validators.required]],
    //   amountPaid:['', [Validators.required]]
    // })

    // this.getPayments();


    // this.activatedRoute.params.subscribe(paramData => {
    //   console.log("ObjectKeys =>",Object.keys(paramData))
    //   console.log("ParamData =>", paramData)
    //   if (Object.keys(paramData).length) {
    //   this.service.getPaymentById(paramData.id).subscribe((data) => {
    //     this.paymentData = data;
    //     console.log('Allocated Data = >',this.paymentData)
    //     const utcfrom = this.convertToUTC(this.paymentData.maintenance.from);
    //     const utcEndDate = this.convertToUTC(this.paymentData.maintenance.endDate);
    //     const updatedLicense = { ...this.paymentData.maintenance, from: utcfrom, endDate: utcEndDate };
    //     this.paymentForm.patchValue(updatedLicense);
    //     console.log("form", this.paymentForm);
    //   })
    // }
    // })
  }

  getPayments() {
    // this.commonservice.getApi(environment.assetServiceUrl+ '/asset/getAllAssets').subscribe({
    //   next: (val: any) => {
    //     this.assetData = val.asset;
    //     console.log("Asset Data",this.assetData);
    //   },
    //   error: (err: any) => {
    //     console.log("Error ",err);
    //   },
    // });
  }



  
  onSubmit(): void {
//     if (this.maintenanceData?.maintenance?._id) {
//       if (this.assetMaintenanceForm.valid) {
//         console.log("Form is valid. Saving data...");
//         console.log(this.assetMaintenanceForm.value);
//         this.commonservice.postApi(environment.assetServiceUrl+ `/asset/addMaintenance/${this.maintenanceData.maintenance ._id}`,this.assetMaintenanceForm.value).subscribe({
//           next: (res: any)=>{
//             if (res.message) {
//               // this.toastrService.success('', 'Asset Updated Successfully', {
//               //   timeOut: 3000,
//               // });
//               this.assetMaintenanceForm.patchValue(res.maintenance)  
//               this.router.navigateByUrl('/assets/maintenance')           
//             }
//           }
//         })
//       } else {
//         // debugger;
//         console.log("Form is invalid. Please check the entered data.");
//       }
//     } else {
//       if (this.assetMaintenanceForm.valid) {
//         console.log("Form is valid. Saving data...");
//         console.log(this.assetMaintenanceForm.value);
//         this.commonservice.postApi(environment.assetServiceUrl+ '/asset/addMaintenance',this.assetMaintenanceForm.value).subscribe({
//           next: (res: any)=>{
//             // if (res?.success) {
//             //   this.toastrService.success('', 'Asset Added Successfully', {
//             //     timeOut: 3000,
//             //   });            
//             // } 
//             //this.assetLicenseForm.reset();  
//             this.router.navigateByUrl('/assets/maintenance')        
//           }
//         })
//       } else {
//         // debugger;
//         console.log("Form is invalid. Please check the entered data.");
//       }   
//     }
}

  columns: ITableColumn[] = [
    { label: 'Serial Number', field: 'serialNum', sortable: true },
    { label: 'Receipt Number', field: 'receiptNum', sortable: true },
    { label: 'Passbook Number', field: 'passbookNum', sortable: true },
    { label: 'Group ID', field: 'groupId', sortable: true },
    { label: 'Amount', field: 'amount', sortable: true }
  ];
}
