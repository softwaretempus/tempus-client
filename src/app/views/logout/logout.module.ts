import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { LogoutComponent } from './logout.component';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
  imports: [
    LogoutRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    LogoutComponent,
  ]
})
export class LogoutModule { }
