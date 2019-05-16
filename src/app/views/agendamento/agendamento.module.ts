import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';

import { AgendamentoComponent } from './agendamento.component';
import { AgendamentoRoutingModule } from './agendamento-routing.module';

@NgModule({
  imports: [
    AgendamentoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    AgendamentoComponent,    
  ]
})
export class AgendamentoModule { }
