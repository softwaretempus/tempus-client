import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    UserComponent,
  ]
})
export class UserModule { }
