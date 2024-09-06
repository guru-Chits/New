import { Component, OnInit } from '@angular/core';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';

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
 bgV:boolean
 data: any[] = [];
 canEdit:boolean=false
 displayedStaffs:any
 staffId:string
 breadcrumsData: any = [
  {
    key: 'Staffs',
    routerLink: 'staff',
  },
  
  {
    key: 'Staff Details',
    routerLink: 'view/:id',
  },
];
constructor(private service:StaffService,private activatedRoute:ActivatedRoute,private router:Router, private authService:AuthService){}

  ngOnInit(): void {
    this.authService.checkAccess('Staffs', 'edit').subscribe((hasAccess: boolean) => {
      if (hasAccess) {
        this.canEdit=true
        // Code to execute when access is granted
        console.log('Create access granted');
      } else {
        // Code to execute when access is denied
        console.log('Create access denied');
      }
    });
    this.activatedRoute.params.subscribe(paramData => {
      if (Object.keys(paramData).length) {
      this.service.getstaffById(paramData.id).subscribe((data) => {
        this.staffDetail = data;
        this.staffId=this.staffDetail.Staff._id  
        
        const bgVerification =this.staffDetail.Staff.bgVerification
        if(bgVerification=="Verified"){
          this.bgV=true
        }else{
          this.bgV=false
        }

         })
      }
      })

      this.service.getstaffAll().subscribe((data)=>{
        this.staffData=data;
           
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
  viewFile(url: string): void {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL is not provided');
    }
  }

  edit(id:any){   
    if(this.canEdit){
      this.router.navigate([`staff/edit/${id}`]);

    } 
  }
}
