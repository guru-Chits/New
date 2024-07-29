import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITab } from '../../interface/tab';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
 /**
   * Active Tab Index
   */
 activeTabIndex: number = 0;

 /**
  * Active Tab
  */
 activeTab: string;

 /**
  * Route path 
  */
 @Input()
 public routePath: string[];

 /**
  * Tabs
  */
 @Input()
 public tabs: ITab[];

 @Input() 
 public onSaveAndNxtBtnClickEvent: Observable<void>;

 @Input() 
 public onBackBtnClickEvent: Observable<void>;

 @Output()
 public onTabSelectEvent: EventEmitter<string> = new EventEmitter<string>();

 constructor(
   private activatedRoute: ActivatedRoute,
   private router: Router,
 ) {}

 ngOnInit(): void {  
   this.activatedRoute.queryParams.subscribe(queryParams => {
     this.activeTab = queryParams.activeTab || this.tabs[0].code;
     this.setActiveTab();
   });

   this.onSaveAndNxtBtnClickEvent.subscribe(() => this.onSaveAndNxtBtnClick());
   this.onBackBtnClickEvent.subscribe(() => this.onBackBtnClick());
 }

 setActiveTab(): void {    
   this.tabs.forEach(tab => tab.active = false); // Deactivate all tabs
   const activeTabIndex = this.getActiveTabIndex(this.activeTab);
   this.activeTabIndex = activeTabIndex < 0 ? 0 : activeTabIndex;
   this.tabs[this.activeTabIndex].active = true;
 }

 getActiveTab(): ITab {
   return this.tabs.find(tab => tab.active);
 }

 getActiveTabIndex(activeTab: string): number {
   return this.tabs.findIndex(tab => tab.code === activeTab);
 }

 onSaveAndNxtBtnClick(): void {
   const activeTab = this.getActiveTab();
   const tabIndex: number = this.getActiveTabIndex(activeTab.code);

   if (tabIndex !== this.tabs.length - 1) {
     const nextTabIndex = tabIndex + 1;
     this.updateQueryParam(nextTabIndex);
   } else {
     this.router.navigate(this.routePath);
   }
 }

 onBackBtnClick(): void {
   const activeTab = this.getActiveTab();
   const tabIndex: number = this.getActiveTabIndex(activeTab.code);
   const prevTabIndex: number = tabIndex - 1 < 0 ? 0 : tabIndex - 1;
   this.updateQueryParam(prevTabIndex);
 }

 /**
  * Update query param
  * @param tabIndex - Tab index
  */
 updateQueryParam(tabIndex: number): void {
   this.router.navigate(
     [],
     {
       relativeTo: this.activatedRoute,
       queryParams: { activeTab: this.tabs[tabIndex].code },
       queryParamsHandling: 'merge'
     }
   );
 }

 onTabSelect(tab: ITab, index): void {
   this.tabs[this.activeTabIndex].active = false;
   this.onTabSelectEvent.emit(tab.code);
   this.activeTabIndex = index;
   this.tabs[this.activeTabIndex].active = true;
 }
}


