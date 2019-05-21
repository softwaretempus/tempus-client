import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  imports: [
    ReportRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ReportComponent,
  ]
})
export class ReportModule { }
