import { Component, OnInit } from '@angular/core';
import { NavigationMenus } from '../../layouts/shared/constants/navigation-menus';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.css']
})
export class AccessManagementComponent implements OnInit {
  moduleNames: string[];
  columns: any[];
  data: any[];
  total: number;
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
      create: false,
      edit: false,
      delete: false
    }));

    this.total = this.data.length;
    
    this.columns = this.generateColumns();
  }

  getModuleNames(): string[] {
    return NavigationMenus.map(menu => menu.title);
  }

  generateColumns(): any[] {
    return [
      { headerName: 'Module', field: 'module', editable: false }, // Non-editable column
      { headerName: 'View', field: 'view', editable: true },
      { headerName: 'Create', field: 'create', editable: true },
      { headerName: 'Edit', field: 'edit', editable: true },
      { headerName: 'Delete', field: 'delete', editable: true }
    ];
  }
}
