import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent{
  selectedItem: string = '';
  privacyActive:String ="assets/settings/Privacy1.svg"
  privacy:string="assets/settings/Privacy.svg"
  rolemanagerActive:String ="assets/settings/RoleManager1.svg"
  rolemanager:string="assets/settings/RoleManager.svg"
  collectiontypeActive:String ="assets/settings/collectiontype1.svg"
  collectiontype:string="assets/settings/CollectionType.svg"
  trashActive:String ="assets/settings/trash1.svg"
  trash:string="assets/settings/trash.svg"

  constructor(private router: Router){}
  ngOnInit(): void {
    // Set 'Privacy' as the default active item
    this.selectItem('Privacy');
    this.isActive('Privacy');
    this.router.navigate(['/settings/privacy']);
  }
  isActive(item: string): boolean {
    return this.selectedItem === item;
  }

  selectItem(item: string) {
    this.selectedItem = item;
  }
}
