import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  imports: [
    ReportRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [

  ]
})
export class ReportModule { }
