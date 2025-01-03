import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { NavigationMenus } from '../shared/constants/navigation-menus';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';

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
  profile: any
  role: string
  /**
   * Location
   */
  public location: Location;

  /**
   * User
   */
  user: { firstName: string, lastName: string, role: string };
  users: any
  /**
   * Constructor
   * @param location - Location
   */
  constructor(location: Location, private router: Router) {
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
    this.profile = localStorage.getItem('profile');
    this.profile = this.profile.replace(/"/g, '')
    this.users = localStorage.getItem('name')
    this.users = this.users.replace(/"/g, '');
    this.role = localStorage.getItem('userRole')
    this.role = this.role.replace(/"/g, '')
    return this.users;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
