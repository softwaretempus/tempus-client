import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { OsComponent } from './os.component';
import { OsEditComponent } from './os-edit.component';
import { OsRoutingModule } from './os-routing.module';

@NgModule({
  imports: [
    OsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    OsComponent,
    OsEditComponent
  ]
})
export class OsModule { }
