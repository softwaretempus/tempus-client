import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { CustomerComponent } from './customer.component';
import { CustomerEditComponent } from './customer-edit.component';
import { CustomerRoutingModule } from './customer-routing.module';

@NgModule({
  imports: [
    CustomerRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    CustomerComponent,
    CustomerEditComponent
  ]
})
export class CustomerModule { }
