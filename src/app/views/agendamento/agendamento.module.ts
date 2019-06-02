import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgendamentoComponent } from './agendamento.component';
import { AgendamentoRoutingModule } from './agendamento-routing.module';

@NgModule({
  imports: [
    AgendamentoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AgendamentoComponent,    
  ]
})
export class AgendamentoModule { }
