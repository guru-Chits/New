import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriberRoutingModule } from './subscriber-routing.module';
import { SubscriberComponent } from './subscriber.component';
import { SubscriberCreateComponent } from './subscriber-create/subscriber-create.component';
import { SubscriberViewComponent } from './subscriber-view/subscriber-view.component';


@NgModule({
  declarations: [
    SubscriberComponent,
    SubscriberCreateComponent,
    SubscriberViewComponent
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule
  ]
})
export class SubscriberModule { }
