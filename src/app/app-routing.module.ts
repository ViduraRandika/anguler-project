import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLocationComponent } from './add-location/add-location.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { HomeComponent } from './home/home.component';
import { ViewMoreInfoComponent } from './view-more-info/view-more-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-report', component: CreateReportComponent },
  { path: 'add-location', component: AddLocationComponent },
  { path: 'view-more-info', component: ViewMoreInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
