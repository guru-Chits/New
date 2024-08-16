import { Component, OnInit } from '@angular/core';
import { NavigationMenus } from '../../layouts/shared/constants/navigation-menus';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrl: './access-management.component.css'
})
export class AccessManagementComponent implements OnInit {
  moduleNames: string[];
  columns: any[];
  data:any[]
  total:number
  breadcrumsData: any = [
    {
      key: 'Access Management',
      routerLink: 'access',
    },
  ];
  constructor() {
    // Extract the titles and store them in the moduleNames array
    this.moduleNames = this.getModuleNames();
  }
  

  ngOnInit(): void {
    this.data = this.moduleNames.map(name => ({
      module: name,
      view: false,
      create: true,
      edit: false,
      delete: false
    }));

    this.total=this.data.length
    console.log(this.data.length);
    

    this.columns = this.generateColumns();
    console.log(this.data);
    console.log(this.columns);

    
  }
  getModuleNames(): string[] {
    return NavigationMenus.map(menu => menu.title);
  }

  generateColumns(): any[] {
    return [
      { headerName: 'Module', field: 'module' },
      { headerName: 'View', field: 'view',  },
      { headerName: 'Create', field: 'create',  },
      { headerName: 'Edit', field: 'edit',  },
      { headerName: 'Delete', field: 'delete',  }
    ];
  }
}
