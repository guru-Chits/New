import { Component, OnInit } from '@angular/core';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrl: './viewall.component.css'
})
export class ViewallComponent implements OnInit {
  constructor(private service:StaffService,private activatedRoute:ActivatedRoute,private router:Router){}
  staffData:any
  data: any[] = [];
  displayedStaff:any
  staffDetail:any
  total:number

ngOnInit(): void {
  
  this.service.getstaffAll().subscribe((data)=>{
    this.staffData=data;
    this.total=this.staffData.AllStaff.length
    console.log("staff data",this.staffData);
   
    this.data=this.staffData.AllStaff.map((staffDetails,index)=>({
      id:staffDetails?._id,
      staffId: staffDetails?.employeeId,
      staffName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
      staffProfile:staffDetails?.profileUrl
    }))
    this.displayedStaff = this.data;
  })
}

applyFilter(filterValue: string) {
  if (!filterValue || !this.data) {
    this.displayedStaff = this.data; // Show all if there's no filter or data is not defined
    return;
  }

  this.displayedStaff = this.data.filter(staff => {
    const staffId = staff.staffId ? staff.staffId.toString().toLowerCase() : '';
    const staffName = staff.staffName ? staff.staffName.toLowerCase() : '';
    return staffId.includes(filterValue.toLowerCase()) || staffName.includes(filterValue.toLowerCase());
  });
  }
  getSub(id:any){
    console.log(id);
    
    this.service.getstaffById(id).subscribe((data) => {
      this.staffDetail = data;
      console.log(this.staffDetail)      
       })

  }
}
