import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ReportUsersComponent } from './report-users.component';
import { ReportUsersRoutingModule } from './report-users-routing.module';

@NgModule({
  imports: [
    ReportUsersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ReportUsersComponent,
  ]
})
export class ReportUsersModule { }
