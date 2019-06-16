import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ReportProjectsComponent } from './report-projects.component';
import { ReportProjectsRoutingModule } from './report-projects-routing.module';

@NgModule({
  imports: [
    ReportProjectsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ReportProjectsComponent,
  ]
})
export class ReportProjectsModule { }
