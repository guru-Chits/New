import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationMenus } from '../shared/constants/navigation-menus';
import { INavigationMenu } from '../shared/interface/navigation-menus';
import { AccessService } from '../../access/service/access.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router, private accessService: AccessService) { }

  public menuItems: INavigationMenu[] = [];  // Start with an empty array
  activeMenu: INavigationMenu;
  matchedMenus: INavigationMenu[] = [];
  public isCollapsed = true;
  roleAccess: any;
  roleDetail: any;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenu();
      }
    });
    
    // Fetch and filter the menu based on access
    this.filterMenuItemsBasedOnAccess();
  }

  filterMenuItemsBasedOnAccess() {
    let user = localStorage.getItem('userRole');
    user = user?.replace(/"/g, '');  // Clean up the role string from session storage

    if (!user) {
      return;  // If no user role is found, don't attempt to filter the menu
    }

    this.accessService.getAccessByRole(user).subscribe(response => {
      this.roleAccess = response;
      this.roleDetail = this.roleAccess?.roleAccess?.roleDetails;

      if (this.roleDetail) {
        console.log(NavigationMenus);
        
        this.menuItems = NavigationMenus.filter(menuItem => {
          const moduleAccess = this.roleDetail.find(rd => rd.moduleName === menuItem.title);
          console.log(moduleAccess);
          
          return moduleAccess && moduleAccess.accessType.view; // Show only menus with 'view' access
        });
      }

      this.setActiveMenu();  // Set the active menu after filtering
    });
  }

  setActiveMenu(menuItem?: INavigationMenu) {

    if (menuItem) {
      this.activeMenu = menuItem;
      
    } else {
      this.activeMenu = this.findActiveMenu(this.menuItems, this.router.url);

      if (!this.activeMenu && this.menuItems.length > 0) {
        this.activeMenu = this.menuItems[0];
      }
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  findActiveMenu(menuItems: INavigationMenu[], url: string): INavigationMenu | null {
    for (const menu of menuItems) {
      if (url.includes(menu.path)) {
        return menu;
      } else if (menu.children) {
        const activeChild = this.findActiveMenu(menu.children, url);
        if (activeChild) {
          return activeChild;
        }
      }
    }
    return null;
  }

  isActive(menuItem: INavigationMenu): boolean {
    return this.activeMenu === menuItem || (this.activeMenu?.children && this.activeMenu.children.includes(menuItem));
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
