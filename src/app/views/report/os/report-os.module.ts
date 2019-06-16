import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ReportOsComponent } from './report-os.component';
import { ReportOsRoutingModule } from './report-os-routing.module';

@NgModule({
  imports: [
    ReportOsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ReportOsComponent,
  ]
})
export class ReportOsModule { }
