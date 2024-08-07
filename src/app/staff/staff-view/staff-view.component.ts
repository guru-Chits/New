import { Component, OnInit } from '@angular/core';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrl: './staff-view.component.css'
})
export class StaffViewComponent implements OnInit {
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = 'assets/subscriber/user.svg'; // Path to default profile image
  isShowDiv = false;  
 staffDetail:any
 staffData:any
 data: any[] = [];
 displayedStaffs:any
 staffId:string
 breadcrumsData: any = [
  {
    key: 'Staff Management',
    routerLink: '',
  },
  
  {
    key: 'View Staff',
    routerLink: 'view/:id',
  },
];
constructor(private service:StaffService,private activatedRoute:ActivatedRoute,private router:Router){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
      this.service.getstaffById(paramData.id).subscribe((data) => {
        this.staffDetail = data;
        this.staffId=this.staffDetail.Staff._id
        console.log(this.staffDetail)
        console.log(this.staffId);
        
         })
      }
      })

      this.service.getstaffAll().subscribe((data)=>{
        this.staffData=data;
    
        console.log("staff data",this.staffData);
       
        this.data=this.staffData.AllStaff.map((staffDetails,index)=>({
          id:staffDetails?._id,
          staffId: staffDetails?.employeeId,
          staffName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
          staffProfile:staffDetails?.profileImageUrl
        }))
        this.displayedStaffs = this.data;
      })
  
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
