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
  constructor(private router: Router,private accessService:AccessService) { }
  public menuItems: INavigationMenu[] = NavigationMenus;
  activeMenu: INavigationMenu;
  matchedMenus: INavigationMenu[] = [];
  public isCollapsed = true;
  roleAccess:any 
  roleDetail:any
  ngOnInit() {
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenu();
      }
    });
    
     this.setActiveMenu();
     this.filterMenuItemsBasedOnAccess();

   }   
  
getRoleAccess(){

}
filterMenuItemsBasedOnAccess() {
  
  let user = sessionStorage.getItem('userRole')
  user=user.replace(/"/g, '');
  console.log(user);
  
  this.accessService.getAccessByRole(user).subscribe(response=>{
    console.log(response);
    this.roleAccess=response
    this.roleDetail=this.roleAccess.roleAccess.roleDetails
    const roleDetails = this.roleAccess.roleAccess.roleDetails;
    this.menuItems = this.menuItems.filter(menuItem => {
      const moduleAccess = roleDetails.find(rd => rd.moduleName === menuItem.title);
      return moduleAccess && moduleAccess.accessType.view; // Show only if the user has view access
    });
  })

}

setActiveMenu(menuItem?: INavigationMenu) {
  if (menuItem) {
    // Set the active menu to the provided menu item
    this.activeMenu = menuItem;
  } else {
    // If no menu item is provided, find and set the active menu based on the router URL
    this.activeMenu = this.findActiveMenu(this.menuItems, this.router.url);

    // If no menu item is found based on the URL, set the first menu item as default
    if (!this.activeMenu && this.menuItems.length > 0) {
      this.activeMenu = this.menuItems[0];
    }
  }

  console.log(this.activeMenu);  // For debugging, you can remove this line in production
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
