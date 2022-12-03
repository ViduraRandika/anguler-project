import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { ViewMoreInfoComponent } from './view-more-info/view-more-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateReportComponent,
    AddLocationComponent,
    ViewMoreInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
