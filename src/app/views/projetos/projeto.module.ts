import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ProjetoComponent } from './projeto.component';
import { ProjetoEditComponent } from './projeto-edit.component';
import { ProjetoRoutingModule } from './projeto-routing.module';

@NgModule({
  imports: [
    ProjetoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ProjetoComponent,
    ProjetoEditComponent
  ]
})
export class ProjetoModule { }
