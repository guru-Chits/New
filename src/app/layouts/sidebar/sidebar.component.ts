import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationMenus } from '../shared/constants/navigation-menus';
import { INavigationMenu } from '../shared/interface/navigation-menus';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) { }
  public menuItems: INavigationMenu[] = NavigationMenus;
  activeMenu: INavigationMenu;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenu();
      }
    });
     this.setActiveMenu();
  }

  setActiveMenu(menuItem?: INavigationMenu) {
    if (menuItem) {
      this.activeMenu = menuItem;
    } else {
      this.activeMenu = this.findActiveMenu(this.menuItems, this.router.url);
    }
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
}
  // public menuItems: INavigationMenu[] = NavigationMenus;
  // activeMenu: INavigationMenu;

  // /**
  //  * Rotate
  //  */
  // rotate: boolean = false;

  // /**
  //  * Menu items
  //  */
  // /**
  //  * Check if the caret icon is collapsed
  //  */
  // public isCollapsed = true;

  // /**
  //  * Constructor
  //  * @param router - Router
  //  */

  // constructor(private router: Router) { }
  // /**
  //  * Angular ngOnInit life cycle hook
  //  */
  // // ngOnInit() {
  // //   // this.router.events.subscribe(() => {
  // //   //   this.setActiveMenu();
  // //   // });
  // //   // Just load the parent menus directly from NavigationMenus
  // //   this.menuItems = NavigationMenus.map(menu => {
  // //     return {
  // //       title: menu.title,
  // //       img: menu.img,
  // //       activeImg: menu.activeImg,
  // //       path:menu.path,
  // //       class: menu.class,
  // //     };
  // //   });

  // //   // Make Home first index to show the home as the first module 
  // //   const homeMenuIndex = this.menuItems.findIndex(menu => menu.title === 'Home');
  // //   if (homeMenuIndex !== -1) {
  // //     const homeMenu = this.menuItems.splice(homeMenuIndex, 1)[0];
  // //     this.menuItems.unshift(homeMenu);
  // //   }

  // //   console.log("menuItems", this.menuItems);

  // //   this.router.events.subscribe((event) => {
  // //     this.isCollapsed = true;
  // //   });
  // // }

  // /**
  //  * @param routePath Method to check if a given routePath is currently active
  //  * @returns boolean
  //  */
  // setActiveMenu(menuItem?: INavigationMenu) {
  //   if (menuItem) {
  //     this.activeMenu = menuItem;
  //   } else {
  //     this.activeMenu = this.menuItems.find(menu => this.router.url.includes(menu.path));
  //   }
  // }

  // isActive(routePath: string): boolean {
  //   return this.router.isActive(routePath, false);
  // }

  // /**
  //  * Toggle submenu
  //  * @param menuItem - Navigation menu item
  //  */
  // toggleSubmenu(menuItem: INavigationMenu) {
  //   if (menuItem.children && menuItem.children.length > 0) {
  //     menuItem['isSubMenuVisible'] = !menuItem['isSubMenuVisible'];
  //     menuItem['rotate'] = !menuItem['rotate'];
  //   }
  // }

  // /**
  //  * logout function
  //  */
  // logout(): void {
  //   sessionStorage.clear();
  //   this.router.navigate(['/login']);
  // }

