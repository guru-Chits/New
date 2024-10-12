import { Component, OnInit } from '@angular/core';
import { StaffService } from '../shared/service/staff.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrl: './viewall.component.css'
})
export class ViewallComponent implements OnInit {
  constructor(private service: StaffService, private activatedRoute: ActivatedRoute, private router: Router) { }
  staffData: any
  data: any[] = [];
  displayedStaff: any
  staffDetail: any
  total: number
  showAll = false;
  itemsPerPage = 10; 

  ngOnInit(): void {
    this.service.getstaffAll().subscribe((data) => {
      this.staffData = data;
      this.total = this.staffData.AllStaff.length

      this.data = this.staffData.AllStaff.map((staffDetails, index) => ({
        id: staffDetails?._id,
        staffId: staffDetails?.employeeId,
        staffName: `${staffDetails?.firstName} ${staffDetails?.lastName}`,
        staffProfile: staffDetails?.profileUrl
      }))
      this.displayedStaff = this.data.slice(0, this.itemsPerPage);
    })
  }

  applyFilter(filterValue: string) {
    if (!filterValue || !this.data) {
      this.displayedStaff = this.data.slice(0, this.itemsPerPage); // Show all if there's no filter or data is not defined
      return;
    }

    this.displayedStaff = this.data.filter(staff => {
      const staffId = staff.staffId ? staff.staffId.toString().toLowerCase() : '';
      const staffName = staff.staffName ? staff.staffName.toLowerCase() : '';
      return staffId.includes(filterValue.toLowerCase()) || staffName.includes(filterValue.toLowerCase());
    });
  }
  getSub(id: any) {
    this.router.navigate([`staff/view/${id}`]);
  }

  viewMore() {
    if (!this.showAll) {
      this.displayedStaff = this.data; 
      this.showAll = true;
    }
  }
}
