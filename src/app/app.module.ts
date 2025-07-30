import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AuthInterceptorService} from './shared/interceptor/auth-interceptor.service'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { HighchartsChartModule } from 'highcharts-angular';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
      BrowserAnimationsModule,
      ToastrModule.forRoot({
      positionClass: 'toast-top-right', 
      timeOut: 1000,
      progressBar: true,
      closeButton: true,
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    HighchartsChartModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
