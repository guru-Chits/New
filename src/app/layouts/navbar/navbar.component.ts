import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { NavigationMenus } from '../shared/constants/navigation-menus';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  /**
   * Focus
   */
  public focus;

  /**
   * List titles
   */
  public listTitles: any[];

  /**
   * Location
   */
  public location: Location;

  /**
   * User
   */
  user: { firstName: string, lastName: string, role: string};

  /**
   * Constructor
   * @param location - Location
   */
  constructor(location: Location) {
    this.location = location;
  }

  /**
   * Angular ngOnInit life cycle hook
   */
  ngOnInit(): void {
    this.listTitles = NavigationMenus.filter(listTitle => listTitle);
    this.user = this.getUserInfo();
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }
  getUserInfo() {
    const user = sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  
  getTitle(): string {
    let title: string = this.location.prepareExternalUrl(this.location.path());

    for (let item = 0; item < this.listTitles.length; item++) {

      //get the menu without children
      if (!this.listTitles[item].children && title.startsWith(this.listTitles[item].path)) {
        if (this.listTitles[item].title === "Home"){
          return `Hello ${this.user.firstName} ${this.user.lastName}`;
        }
        return this.listTitles[item].title;
      }

      //get title of the child menu
      else if (this.listTitles[item].children) {
        for (let childItem = 0; childItem < this.listTitles[item].children.length; childItem++){
          if (this.listTitles[item].children[childItem].path === title){
            return this.listTitles[item].children[childItem].title
          }
          //children title remains same for inner routing 
          else if (title.startsWith(this.listTitles[item].children[childItem].path)) {
            return this.listTitles[item].children[childItem].title;
          }
        }
      }
    }
  }

}
